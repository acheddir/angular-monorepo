import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  template,
  move,
  mergeWith,
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

function addProjectToAngularJson(
  tree: Tree,
  projectName: string,
  projectPath: string,
  prefix: string
): void {
  const angularJsonPath = "/angular.json";
  const angularJson = JSON.parse(tree.read(angularJsonPath)!.toString("utf-8"));

  if (!angularJson.projects[projectName]) {
    angularJson.projects[projectName] = {
      projectType: "library",
      root: projectPath,
      sourceRoot: `${projectPath}/src`,
      prefix: prefix,
      architect: {
        build: {
          builder: "@angular/build:ng-packagr",
          configurations: {
            production: {
              tsConfig: `${projectPath}/tsconfig.lib.prod.json`,
            },
            development: {
              tsConfig: `${projectPath}/tsconfig.lib.json`,
            },
          },
          defaultConfiguration: "production",
        },
        test: {
          builder: "@angular/build:unit-test",
          options: {
            tsConfig: `${projectPath}/tsconfig.spec.json`,
          },
        },
      },
    };

    tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2) + "\n");
  }
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

export function types(options: TypesSchematicSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const { app, shared } = options;
    let { domain } = options;

    // Prompt for domain only if NOT shared and domain is NOT provided
    if (!shared && !domain) {
      const inquirer = await import("inquirer");
      const answers = await inquirer.default.prompt([
        {
          type: "input",
          name: "domain",
          message: "Which domain does this types library belong to?",
        },
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
        prefix: app,
      }),
      move(projectPath),
    ]);

    // Add to angular.json
    addProjectToAngularJson(tree, projectName, projectPath, app);

    // Conditional alias path
    const aliasPath = shared ? `@${app}/shared/types` : `@${app}/${domainName}/types`;

    // Add path alias
    addPathAliasToTsConfig(tree, aliasPath, `./${projectPath}/src/public-api.ts`);

    return mergeWith(templateSource);
  };
}
