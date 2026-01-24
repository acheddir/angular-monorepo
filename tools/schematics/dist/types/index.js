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
exports.types = types;
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
function types(options) {
    return async (tree, context) => {
        // Handle help flag
        if (options.help) {
            context.logger.info(HELP_TEXT);
            return (0, schematics_1.noop)();
        }
        const { app } = options;
        let { domain, shared } = options;
        // If domain is not provided and shared is not true, ask if it's shared
        if (!domain && !shared) {
            const inquirer = await Promise.resolve().then(() => __importStar(require("inquirer")));
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
        }
        else if (!shared && !domain) {
            // This shouldn't happen, but failsafe for domain prompt
            const inquirer = await Promise.resolve().then(() => __importStar(require("inquirer")));
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
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)("./files/types"), [
            (0, schematics_1.template)({
                ...core_1.strings,
                name: shared ? "shared" : domainName,
                className,
                fileName,
                domain: shared ? "shared" : domainName,
                app,
                relativePath,
                prefix: app
            }),
            (0, schematics_1.move)(projectPath)
        ]);
        // Create project.json in the library directory
        createProjectJson(tree, projectName, projectPath, app);
        // Conditional alias path
        const aliasPath = shared ? `@${app}/shared/types` : `@${app}/${domainName}/types`;
        // Add path alias
        addPathAliasToTsConfig(tree, aliasPath, `./${projectPath}/src/public-api.ts`);
        return (0, schematics_1.mergeWith)(templateSource);
    };
}
