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
exports.feature = feature;
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
function addRouteToShell(tree, app, domain, featureName, className) {
    const routesPath = `libs/${app}/shell/feature-shell/src/lib/root-shell.routes.ts`;
    if (!tree.exists(routesPath)) {
        return;
    }
    const content = tree.read(routesPath).toString("utf-8");
    const lines = content.split("\n");
    // Find the children array by looking for "children: ["
    let childrenStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("children: [")) {
            childrenStartIndex = i;
            break;
        }
    }
    if (childrenStartIndex === -1) {
        return;
    }
    // Find the matching closing bracket for children array
    let childrenEndIndex = -1;
    let depth = 0;
    for (let i = childrenStartIndex; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes("["))
            depth++;
        if (line.includes("]")) {
            depth--;
            if (depth === 0) {
                childrenEndIndex = i;
                break;
            }
        }
    }
    if (childrenEndIndex === -1) {
        return;
    }
    // Add comma to the last route if it doesn't have one
    for (let i = childrenEndIndex - 1; i >= childrenStartIndex; i--) {
        const trimmed = lines[i].trim();
        if (trimmed === "}" || trimmed.startsWith("}")) {
            if (!trimmed.endsWith(",")) {
                lines[i] = lines[i] + ",";
            }
            break;
        }
    }
    // Add the new route before the closing bracket
    const newRoute = `      {
        path: "${domain}/${featureName}",
        loadComponent: async () => (await import("@${app}/${domain}/feature-${featureName}")).Feature${className}
      }`;
    lines.splice(childrenEndIndex, 0, newRoute);
    tree.overwrite(routesPath, lines.join("\n"));
}
function addNavigationItem(tree, app, domain, featureName, className) {
    const shellPath = `libs/${app}/shell/feature-shell/src/lib/root-shell.ts`;
    if (!tree.exists(shellPath)) {
        return;
    }
    const content = tree.read(shellPath).toString("utf-8");
    // Find the navItems array
    const navItemsRegex = /public navItems: NavItem\[\] = \[(.*?)\];/s;
    const match = content.match(navItemsRegex);
    if (!match) {
        return;
    }
    const currentItems = match[1].trim();
    const label = classify(featureName);
    const newItem = `{ label: "${label}", path: "/${domain}/${featureName}" }`;
    // Add the new item to the array
    const updatedItems = currentItems ? `${currentItems}, ${newItem}` : newItem;
    const updatedContent = content.replace(navItemsRegex, `public navItems: NavItem[] = [${updatedItems}];`);
    tree.overwrite(shellPath, updatedContent);
}
function feature(options) {
    return async (tree, _context) => {
        const { app, domain, name } = options;
        let { routing, navigation } = options;
        // If navigation is true, routing must also be true
        if (navigation && !routing) {
            routing = true;
        }
        // If neither flag is explicitly provided via CLI, prompt for routing first
        if (!routing && !navigation) {
            const inquirer = await Promise.resolve().then(() => __importStar(require("inquirer")));
            const routingAnswer = await inquirer.default.prompt([
                {
                    type: "confirm",
                    name: "routing",
                    message: "Add route to shell?",
                    default: false,
                },
            ]);
            routing = routingAnswer.routing;
            // If routing is true, also ask about navigation
            if (routing) {
                const navAnswer = await inquirer.default.prompt([
                    {
                        type: "confirm",
                        name: "navigation",
                        message: "Add to navigation menu?",
                        default: false,
                    },
                ]);
                navigation = navAnswer.navigation;
            }
        }
        else if (routing && navigation === undefined) {
            // If only routing is explicitly set to true, ask about navigation
            const inquirer = await Promise.resolve().then(() => __importStar(require("inquirer")));
            const navAnswer = await inquirer.default.prompt([
                {
                    type: "confirm",
                    name: "navigation",
                    message: "Add to navigation menu?",
                    default: false,
                },
            ]);
            navigation = navAnswer.navigation;
        }
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
                prefix: app
            }),
            (0, schematics_1.move)(projectPath)
        ]);
        // Create project.json in the library directory
        createProjectJson(tree, projectName, projectPath, app);
        // Add path alias
        addPathAliasToTsConfig(tree, `@${app}/${domainName}/feature-${featureName}`, `./${projectPath}/src/public-api.ts`);
        // Add routing if requested
        if (routing) {
            addRouteToShell(tree, app, domainName, featureName, className);
        }
        // Add navigation if requested
        if (navigation) {
            addNavigationItem(tree, app, domainName, featureName, className);
        }
        return (0, schematics_1.mergeWith)(templateSource);
    };
}
