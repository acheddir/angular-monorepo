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
import { DataSchematicSchema } from "./schema";

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

export function data(options: DataSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { app, domain } = options;
    const domainName = dasherize(domain);
    const projectPath = `libs/${app}/modules/${domainName}/data`;
    const projectName = `${domainName}-data`;

    const className = classify(domain);
    const fileName = domainName;

    // Calculate relative path depth (libs/app/modules/domain/data = 5 levels)
    const relativePath = calculateRelativePath(5);

    const templateSource = apply(url("./files/data"), [
      template({
        ...strings,
        name: domainName,
        className,
        fileName,
        domain: domainName,
        app,
        relativePath,
        prefix: app,
      }),
      move(projectPath),
    ]);

    // Add to angular.json
    addProjectToAngularJson(tree, projectName, projectPath, app);

    // Add path alias
    addPathAliasToTsConfig(
      tree,
      `@${app}/${domainName}/data`,
      `./${projectPath}/src/public-api.ts`
    );

    return mergeWith(templateSource);
  };
}
