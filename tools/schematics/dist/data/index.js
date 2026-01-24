"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = data;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
function dasherize(str) {
    return core_1.strings.dasherize(str);
}
function classify(str) {
    return core_1.strings.classify(str);
}
function calculateRelativePath(depth) {
    return "../".repeat(depth);
}
function createProjectJson(tree, projectName, projectPath, prefix) {
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
function addPathAliasToTsConfig(tree, aliasPath, targetPath) {
    const tsconfigPath = "/tsconfig.json";
    const tsconfig = JSON.parse(tree.read(tsconfigPath).toString("utf-8"));
    if (!tsconfig.compilerOptions.paths) {
        tsconfig.compilerOptions.paths = {};
    }
    if (!tsconfig.compilerOptions.paths[aliasPath]) {
        tsconfig.compilerOptions.paths[aliasPath] = [targetPath];
        tree.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");
    }
}
function data(options) {
    return (tree, _context) => {
        const { app, domain } = options;
        const domainName = dasherize(domain);
        const projectPath = `libs/${app}/modules/${domainName}/data`;
        const projectName = `${domainName}-data`;
        const className = classify(domain);
        const fileName = domainName;
        // Calculate relative path depth (libs/app/modules/domain/data = 5 levels)
        const relativePath = calculateRelativePath(5);
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)("./files/data"), [
            (0, schematics_1.template)({
                ...core_1.strings,
                name: domainName,
                className,
                fileName,
                domain: domainName,
                app,
                relativePath,
                prefix: app
            }),
            (0, schematics_1.move)(projectPath)
        ]);
        // Create project.json in the library directory
        createProjectJson(tree, projectName, projectPath, app);
        // Add path alias
        addPathAliasToTsConfig(tree, `@${app}/${domainName}/data`, `./${projectPath}/src/public-api.ts`);
        return (0, schematics_1.mergeWith)(templateSource);
    };
}
