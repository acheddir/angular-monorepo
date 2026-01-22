"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domain = domain;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
function dasherize(str) {
    return core_1.strings.dasherize(str);
}
function classify(str) {
    return core_1.strings.classify(str);
}
function camelize(str) {
    return core_1.strings.camelize(str);
}
function calculateRelativePath(depth) {
    return "../".repeat(depth);
}
function addProjectToAngularJson(tree, projectName, projectPath, prefix) {
    const angularJsonPath = "/angular.json";
    const angularJson = JSON.parse(tree.read(angularJsonPath).toString("utf-8"));
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
function createFeatureLibrary(options) {
    return (tree, _context) => {
        const { app, domain, name } = options;
        const featureName = dasherize(name);
        const domainName = dasherize(domain);
        const projectPath = `libs/${app}/modules/${domainName}/feature-${featureName}`;
        const projectName = `feature-${featureName}`;
        const className = classify(name);
        const fileName = featureName;
        // Calculate relative path depth (libs/app/modules/domain/feature-name = 5 levels)
        const relativePath = calculateRelativePath(5);
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)("./files/feature-__name__"), [
            (0, schematics_1.template)({
                ...core_1.strings,
                name: featureName,
                className,
                fileName,
                domain: domainName,
                app,
                relativePath,
                prefix: app,
            }),
            (0, schematics_1.move)(projectPath),
        ]);
        // Add to angular.json
        addProjectToAngularJson(tree, projectName, projectPath, app);
        // Add path alias
        addPathAliasToTsConfig(tree, `@${app}/${domainName}/${featureName}`, `./${projectPath}/src/public-api.ts`);
        return (0, schematics_1.mergeWith)(templateSource);
    };
}
function createDataLibrary(options) {
    return (tree, _context) => {
        const { app, domain } = options;
        const domainName = dasherize(domain);
        const projectPath = `libs/${app}/modules/${domainName}/data`;
        const projectName = `${domainName}-data`;
        // Check if data library already exists
        if (tree.exists(`${projectPath}/src/public-api.ts`)) {
            return (0, schematics_1.noop)();
        }
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
                prefix: app,
            }),
            (0, schematics_1.move)(projectPath),
        ]);
        // Add to angular.json
        addProjectToAngularJson(tree, projectName, projectPath, app);
        // Add path alias
        addPathAliasToTsConfig(tree, `@${app}/${domainName}/data`, `./${projectPath}/src/public-api.ts`);
        return (0, schematics_1.mergeWith)(templateSource);
    };
}
function createTypesLibrary(options) {
    return (tree, _context) => {
        const { app, domain } = options;
        const domainName = dasherize(domain);
        const projectPath = `libs/${app}/modules/${domainName}/types`;
        const projectName = `${domainName}-types`;
        // Check if types library already exists
        if (tree.exists(`${projectPath}/src/public-api.ts`)) {
            return (0, schematics_1.noop)();
        }
        const className = classify(domain);
        const fileName = domainName;
        // Calculate relative path depth (libs/app/modules/domain/types = 5 levels)
        const relativePath = calculateRelativePath(5);
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)("./files/types"), [
            (0, schematics_1.template)({
                ...core_1.strings,
                name: domainName,
                className,
                fileName,
                domain: domainName,
                app,
                relativePath,
                prefix: app,
            }),
            (0, schematics_1.move)(projectPath),
        ]);
        // Add to angular.json
        addProjectToAngularJson(tree, projectName, projectPath, app);
        // Add path alias
        addPathAliasToTsConfig(tree, `@${app}/${domainName}/types`, `./${projectPath}/src/public-api.ts`);
        return (0, schematics_1.mergeWith)(templateSource);
    };
}
function domain(options) {
    return (0, schematics_1.chain)([
        createTypesLibrary(options),
        createDataLibrary(options),
        createFeatureLibrary(options),
    ]);
}
