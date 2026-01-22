"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.util = util;
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
function util(options) {
    return async (tree, _context) => {
        const { app, name, shared } = options;
        let { domain } = options;
        // Prompt for domain only if NOT shared and domain is NOT provided
        if (!shared && !domain) {
            const inquirer = await Promise.resolve().then(() => __importStar(require("inquirer")));
            const answers = await inquirer.default.prompt([
                {
                    type: "input",
                    name: "domain",
                    message: "Which domain does this utility belong to?",
                },
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
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)("./files/util-__name__"), [
            (0, schematics_1.template)({
                ...core_1.strings,
                name: utilName,
                className,
                fileName,
                domain: shared ? "shared" : domainName,
                app,
                relativePath,
                prefix: app,
            }),
            (0, schematics_1.move)(projectPath),
        ]);
        // Add to angular.json
        addProjectToAngularJson(tree, projectName, projectPath, app);
        // Conditional alias path
        const aliasPath = shared
            ? `@${app}/shared/util-${utilName}`
            : `@${app}/${domainName}/util-${utilName}`;
        // Add path alias
        addPathAliasToTsConfig(tree, aliasPath, `./${projectPath}/src/public-api.ts`);
        return (0, schematics_1.mergeWith)(templateSource);
    };
}
