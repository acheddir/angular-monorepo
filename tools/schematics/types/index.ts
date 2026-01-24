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
import { TypesSchematicSchema } from "./schema";

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
Types Schematic - Generate a single types/models library

USAGE:
  ng g @tools/schematics:types [options]
  ng g types [options]

OPTIONS:
  --app <string>       Target app name (e.g., app) [required]
  --domain <string>    Domain name (e.g., products, users)
  --shared             Place in shared folder instead of domain
  --help, -h           Show this help message

EXAMPLES:
  ng g types --app=app --domain=products
  ng g types --app=app --shared

OUTPUT PATHS:
  Domain:  libs/{app}/modules/{domain}/types/
  Shared:  libs/{app}/shared/types/

PATH ALIASES:
  Domain:  @{app}/{domain}/types
  Shared:  @{app}/shared/types
`;

export function types(options: TypesSchematicSchema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    // Handle help flag
    if (options.help) {
      context.logger.info(HELP_TEXT);
      return noop();
    }

    const { app } = options;
    let { domain, shared } = options;

    // If domain is not provided and shared is not true, ask if it's shared
    if (!domain && !shared) {
      const inquirer = await import("inquirer");
      const sharedAnswer = await inquirer.default.prompt([
        {
          type: "confirm",
          name: "shared",
          message: "Is this types library shared across domains?",
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
            message: "Which domain does this types library belong to?"
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
          message: "Which domain does this types library belong to?"
        }
      ]);
      domain = answers.domain;
    }

    const domainName = domain ? dasherize(domain) : "";

    // Conditional path based on shared flag
    const projectPath = shared
      ? `libs/${app}/shared/types`
      : `libs/${app}/modules/${domainName}/types`;
    const projectName = shared ? "shared-types" : `${domainName}-types`;

    const className = domain ? classify(domain) : "Shared";
    const fileName = domain ? domainName : "shared";

    // Calculate relative path depth (libs/app/modules/domain/types = 5 levels, libs/app/shared/types = 4 levels)
    const relativePath = calculateRelativePath(shared ? 4 : 5);

    const templateSource = apply(url("./files/types"), [
      template({
        ...strings,
        name: shared ? "shared" : domainName,
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
    const aliasPath = shared ? `@${app}/shared/types` : `@${app}/${domainName}/types`;

    // Add path alias
    addPathAliasToTsConfig(tree, aliasPath, `./${projectPath}/src/public-api.ts`);

    return mergeWith(templateSource);
  };
}
