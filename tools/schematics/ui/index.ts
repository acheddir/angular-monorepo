import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  template,
  move,
  mergeWith,
  noop
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { UiSchematicSchema } from "./schema";

function dasherize(str: string): string {
  return strings.dasherize(str);
}

function classify(str: string): string {
  return strings.classify(str);
}

function calculateRelativePath(depth: number): string {
  return "../".repeat(depth);
}

function createProjectJson(
  tree: Tree,
  projectName: string,
  projectPath: string,
  prefix: string
): void {
  const projectJsonPath = `${projectPath}/project.json`;

  if (tree.exists(projectJsonPath)) {
    return;
  }

  const projectJson = {
    name: projectName,
    projectType: "library",
    prefix: prefix,
    architect: {
      build: {
        builder: "@angular/build:ng-packagr",
        configurations: {
          production: {
            tsConfig: `${projectPath}/tsconfig.lib.prod.json`
          },
          development: {
            tsConfig: `${projectPath}/tsconfig.lib.json`
          }
        },
        defaultConfiguration: "production"
      },
      test: {
        builder: "@angular/build:unit-test",
        options: {
          tsConfig: `${projectPath}/tsconfig.spec.json`
        }
      }
    }
  };

  tree.create(projectJsonPath, JSON.stringify(projectJson, null, 2) + "\n");
}

function addPathAliasToTsConfig(tree: Tree, aliasPath: string, targetPath: string): void {
  const tsconfigPath = "/tsconfig.json";
  const tsconfig = JSON.parse(tree.read(tsconfigPath)!.toString("utf-8"));

  if (!tsconfig.compilerOptions.paths) {
    tsconfig.compilerOptions.paths = {};
  }

  if (!tsconfig.compilerOptions.paths[aliasPath]) {
    tsconfig.compilerOptions.paths[aliasPath] = [targetPath];
    tree.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");
  }
}

const HELP_TEXT = `
UI Schematic - Generate a single UI component library

USAGE:
  ng g @tools/schematics:ui [options]
  ng g ui [options]

OPTIONS:
  --app <string>       Target app name (e.g., app) [required]
  --name <string>      UI component name (e.g., hero, card) [required]
  --domain <string>    Domain name (e.g., products, users)
  --shared             Place in shared folder instead of domain
  --help, -h           Show this help message

EXAMPLES:
  ng g ui --app=app --domain=products --name=card
  ng g ui --app=app --name=button --shared

OUTPUT PATHS:
  Domain:  libs/{app}/modules/{domain}/ui-{name}/
  Shared:  libs/{app}/shared/components/ui-{name}/

PATH ALIASES:
  Domain:  @{app}/{domain}/ui-{name}
  Shared:  @{app}/shared/ui-{name}
`;

export function ui(options: UiSchematicSchema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    // Handle help flag
    if (options.help) {
      context.logger.info(HELP_TEXT);
      return noop();
    }

    const { app, name } = options;
    let { domain, shared } = options;

    // If domain is not provided and shared is not true, ask if it's shared
    if (!domain && !shared) {
      const inquirer = await import("inquirer");
      const sharedAnswer = await inquirer.default.prompt([
        {
          type: "confirm",
          name: "shared",
          message: "Is this UI component shared across domains?",
          default: false
        }
      ]);
      shared = sharedAnswer.shared;

      // If not shared, prompt for domain
      if (!shared) {
        const domainAnswer = await inquirer.default.prompt([
          {
            type: "input",
            name: "domain",
            message: "Which domain does this UI component belong to?"
          }
        ]);
        domain = domainAnswer.domain;
      }
    } else if (!shared && !domain) {
      // This shouldn't happen, but failsafe for domain prompt
      const inquirer = await import("inquirer");
      const answers = await inquirer.default.prompt([
        {
          type: "input",
          name: "domain",
          message: "Which domain does this UI component belong to?"
        }
      ]);
      domain = answers.domain;
    }

    const uiName = dasherize(name);
    const domainName = domain ? dasherize(domain) : "";

    // Conditional path based on shared flag
    const projectPath = shared
      ? `libs/${app}/shared/components/ui-${uiName}`
      : `libs/${app}/modules/${domainName}/ui-${uiName}`;
    const projectName = `ui-${uiName}`;
    const className = classify(name);
    const fileName = uiName;

    // Calculate relative path depth (libs/app/modules/domain/ui-name = 5 levels, libs/app/shared/components/ui-name = 5 levels)
    const relativePath = calculateRelativePath(5);

    const templateSource = apply(url("./files/ui-__name__"), [
      template({
        ...strings,
        name: uiName,
        className,
        fileName,
        domain: shared ? "shared" : domainName,
        app,
        relativePath,
        prefix: app
      }),
      move(projectPath)
    ]);

    // Create project.json in the library directory
    createProjectJson(tree, projectName, projectPath, app);

    // Conditional alias path
    const aliasPath = shared ? `@${app}/shared/ui-${uiName}` : `@${app}/${domainName}/ui-${uiName}`;

    // Add path alias
    addPathAliasToTsConfig(tree, aliasPath, `./${projectPath}/src/public-api.ts`);

    return mergeWith(templateSource);
  };
}
