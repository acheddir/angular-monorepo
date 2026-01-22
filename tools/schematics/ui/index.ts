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

export function ui(options: UiSchematicSchema): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const { app, name, shared } = options;
    let { domain } = options;

    // Prompt for domain only if NOT shared and domain is NOT provided
    if (!shared && !domain) {
      const inquirer = await import("inquirer");
      const answers = await inquirer.default.prompt([
        {
          type: "input",
          name: "domain",
          message: "Which domain does this UI component belong to?",
        },
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
        prefix: app,
      }),
      move(projectPath),
    ]);

    // Add to angular.json
    addProjectToAngularJson(tree, projectName, projectPath, app);

    // Conditional alias path
    const aliasPath = shared ? `@${app}/shared/ui-${uiName}` : `@${app}/${domainName}/ui-${uiName}`;

    // Add path alias
    addPathAliasToTsConfig(tree, aliasPath, `./${projectPath}/src/public-api.ts`);

    return mergeWith(templateSource);
  };
}
