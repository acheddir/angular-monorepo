#!/usr/bin/env node

/**
 * Angular Template Setup Script
 *
 * This script renames the template project from "app" to your chosen app name.
 * Run this after creating a new repository from the template.
 *
 * Usage: node scripts/setup.mjs
 */

import { createInterface } from "node:readline";
import {
  readFileSync,
  writeFileSync,
  renameSync,
  rmSync,
  existsSync,
  readdirSync,
  statSync
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "..");

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function validateAppName(name) {
  if (!name || name.trim().length === 0) {
    return "App name cannot be empty";
  }

  const trimmed = name.trim().toLowerCase();

  if (!/^[a-z][a-z0-9-]*$/.test(trimmed)) {
    return "App name must start with a letter and contain only lowercase letters, numbers, and hyphens";
  }

  if (trimmed === "app") {
    return 'App name cannot be "app" - that\'s the template name';
  }

  if (trimmed.length > 50) {
    return "App name must be 50 characters or less";
  }

  return null;
}

function getAllFiles(dir, files = []) {
  if (!existsSync(dir)) return files;

  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    if (statSync(fullPath).isDirectory()) {
      if (!["node_modules", "dist", ".git", ".angular"].includes(item)) {
        getAllFiles(fullPath, files);
      }
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function replaceInFile(filePath, oldName, newName) {
  const content = readFileSync(filePath, "utf-8");

  // Replace various patterns
  let newContent = content
    // Replace @app/ imports and paths
    .replace(new RegExp(`@${oldName}/`, "g"), `@${newName}/`)
    // Replace app/ paths (with trailing slash)
    .replace(new RegExp(`apps/${oldName}/`, "g"), `apps/${newName}/`)
    .replace(new RegExp(`libs/${oldName}/`, "g"), `libs/${newName}/`)
    // Replace app paths at end of strings (e.g., "root": "apps/app")
    .replace(new RegExp(`apps/${oldName}"`, "g"), `apps/${newName}"`)
    .replace(new RegExp(`libs/${oldName}"`, "g"), `libs/${newName}"`)
    // Replace prefix in configs
    .replace(new RegExp(`"prefix": "${oldName}"`, "g"), `"prefix": "${newName}"`)
    .replace(new RegExp(`prefix: \\["${oldName}"\\]`, "g"), `prefix: ["${newName}"]`)
    // Replace project names in angular.json
    .replace(new RegExp(`"${oldName}":`, "g"), `"${newName}":`)
    .replace(new RegExp(`buildTarget": "${oldName}:`, "g"), `buildTarget": "${newName}:`)
    // Replace in package.json scripts
    .replace(new RegExp(`ng serve ${oldName}`, "g"), `ng serve ${newName}`)
    .replace(new RegExp(`ng build ${oldName}`, "g"), `ng build ${newName}`)
    .replace(new RegExp(`build:${oldName}`, "g"), `build:${newName}`)
    .replace(new RegExp(`pnpm build:${oldName}`, "g"), `pnpm build:${newName}`)
    // Replace selector prefixes in component templates and configs (HTML tags)
    .replace(new RegExp(`<${oldName}-`, "g"), `<${newName}-`)
    .replace(new RegExp(`</${oldName}-`, "g"), `</${newName}-`)
    // Replace selector strings in TypeScript decorators (e.g., selector: "app-root")
    .replace(new RegExp(`"${oldName}-`, "g"), `"${newName}-`)
    // Replace standalone app references in selectors (e.g., <app-root></app-root>)
    .replace(new RegExp(`<${oldName}>`, "g"), `<${newName}>`)
    .replace(new RegExp(`</${oldName}>`, "g"), `</${newName}>`)
    // Replace in comments and documentation
    .replace(new RegExp(`/${oldName}/`, "g"), `/${newName}/`)
    // Replace signal/title values like signal("app")
    .replace(new RegExp(`signal\\("${oldName}"\\)`, "g"), `signal("${newName}")`)
    // Replace capitalized Demo in templates (e.g., "@2025 Demo" footer)
    .replace(new RegExp(`\\b${capitalize(oldName)}\\b`, "g"), capitalize(newName));

  if (content !== newContent) {
    writeFileSync(filePath, newContent, "utf-8");
    return true;
  }
  return false;
}

function renameDirectory(oldPath, newPath) {
  if (existsSync(oldPath)) {
    renameSync(oldPath, newPath);
    return true;
  }
  return false;
}

async function main() {
  console.log("\n🚀 Angular Template Setup\n");
  console.log("This script will rename the template project from 'app' to your chosen name.\n");

  // Get and validate app name
  let appName;
  while (true) {
    const input = await question("Enter your app name (lowercase, e.g., myapp): ");
    const error = validateAppName(input);
    if (error) {
      console.log(`❌ ${error}\n`);
      continue;
    }
    appName = input.trim().toLowerCase();
    break;
  }

  console.log(`\n📝 Renaming project to: ${appName}\n`);

  const filesToUpdate = [
    "angular.json",
    "tsconfig.json",
    "package.json",
    "sheriff.config.ts",
    "eslint.config.mjs",
    "README.md",
    ".github/TEMPLATE_SETUP.md"
  ];

  // Step 1: Update configuration files in root
  console.log("📄 Updating configuration files...");
  for (const file of filesToUpdate) {
    const filePath = join(ROOT_DIR, file);
    if (existsSync(filePath)) {
      if (replaceInFile(filePath, "app", appName)) {
        console.log(`   ✓ ${file}`);
      }
    }
  }

  // Step 2: Update all files in apps/app and libs/app
  console.log("\n📁 Updating files in apps and libs...");

  const appsDir = join(ROOT_DIR, "apps", "app");
  const libsDir = join(ROOT_DIR, "libs", "app");

  const allFiles = [...getAllFiles(appsDir), ...getAllFiles(libsDir)];

  let updatedCount = 0;
  for (const filePath of allFiles) {
    if (replaceInFile(filePath, "app", appName)) {
      updatedCount++;
    }
  }
  console.log(`   ✓ Updated ${updatedCount} files`);

  // Step 3: Rename directories
  console.log("\n📂 Renaming directories...");

  const newAppsDir = join(ROOT_DIR, "apps", appName);
  const newLibsDir = join(ROOT_DIR, "libs", appName);

  if (renameDirectory(appsDir, newAppsDir)) {
    console.log(`   ✓ apps/app → apps/${appName}`);
  }

  if (renameDirectory(libsDir, newLibsDir)) {
    console.log(`   ✓ libs/app → libs/${appName}`);
  }

  // Step 4: Update package.json name field
  console.log("\n📦 Updating package.json name...");
  const packageJsonPath = join(ROOT_DIR, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  packageJson.name = appName;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
  console.log(`   ✓ Set package name to: ${appName}`);

  // Step 5: Self-delete
  console.log("\n🗑️  Cleaning up setup script...");
  rl.close();

  // Delete the setup script
  const scriptPath = join(ROOT_DIR, "scripts", "setup.mjs");
  rmSync(scriptPath);
  console.log("   ✓ Removed scripts/setup.mjs");

  // Try to remove scripts directory if empty
  const scriptsDir = join(ROOT_DIR, "scripts");
  try {
    const remaining = readdirSync(scriptsDir);
    if (remaining.length === 0) {
      rmSync(scriptsDir, { recursive: true });
      console.log("   ✓ Removed empty scripts/ directory");
    }
  } catch {
    // Directory not empty or doesn't exist, that's fine
  }

  console.log("\n✅ Setup complete!\n");
  console.log("Next steps:");
  console.log("  1. Run: pnpm install");
  console.log("  2. Run: pnpm start");
  console.log(`  3. Open: http://localhost:4200\n`);
  console.log("Happy coding! 🎉\n");
}

main().catch((error) => {
  console.error("❌ Setup failed:", error.message);
  rl.close();
  process.exit(1);
});
