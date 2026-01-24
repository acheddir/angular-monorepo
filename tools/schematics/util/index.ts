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
import { UtilSchematicSchema } from "./schema";

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
Util Schematic - Generate a single utility library

USAGE:
  ng g @tools/schematics:util [options]
  ng g util [options]

OPTIONS:
  --app <string>       Target app name (e.g., app) [required]
  --name <string>      Utility name (e.g., formatters, validators) [required]
  --domain <string>    Domain name (e.g., products, users)
  --shared             Place in shared folder instead of domain
  --help, -h           Show this help message

EXAMPLES:
  ng g util --app=app --domain=products --name=formatters
  ng g util --app=app --name=date-helpers --shared

OUTPUT PATHS:
  Domain:  libs/{app}/modules/{domain}/util-{name}/
  Shared:  libs/{app}/shared/util-{name}/

PATH ALIASES:
  Domain:  @{app}/{domain}/util-{name}
  Shared:  @{app}/shared/util-{name}
`;

export function util(options: UtilSchematicSchema): Rule {
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
          message: "Is this utility shared across domains?",
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
            message: "Which domain does this utility belong to?"
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
          message: "Which domain does this utility belong to?"
        }
      ]);
      domain = answers.domain;
    }

    const utilName = dasherize(name);
    const domainName = domain ? dasherize(domain) : "";

    // Conditional path based on shared flag
    const projectPath = shared
      ? `libs/${app}/shared/util-${utilName}`
      : `libs/${app}/modules/${domainName}/util-${utilName}`;
    const projectName = `util-${utilName}`;
    const className = classify(name);
    const fileName = utilName;

    // Calculate relative path depth (libs/app/modules/domain/util-name = 5 levels, libs/app/shared/util-name = 4 levels)
    const relativePath = calculateRelativePath(shared ? 4 : 5);

    const templateSource = apply(url("./files/util-__name__"), [
      template({
        ...strings,
        name: utilName,
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
    const aliasPath = shared
      ? `@${app}/shared/util-${utilName}`
      : `@${app}/${domainName}/util-${utilName}`;

    // Add path alias
    addPathAliasToTsConfig(tree, aliasPath, `./${projectPath}/src/public-api.ts`);

    return mergeWith(templateSource);
  };
}
