#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = resolve(ROOT, ".env");
const APP_ENV_RE = /^APP_/i;

function parseEnvFile(filePath) {
  const vars = {};
  for (const line of readFileSync(filePath, "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    vars[key] = val;
  }
  return vars;
}

const fileVars = existsSync(ENV_FILE) ? parseEnvFile(ENV_FILE) : {};

const merged = { ...fileVars, ...process.env };

const defineFlags = [];
for (const [key, value] of Object.entries(merged)) {
  if (APP_ENV_RE.test(key)) {
    defineFlags.push(`--define=process.env.${key}='${value}'`);
  }
}

const ngArgs = process.argv.slice(2);
const result = spawnSync("pnpm", ["exec", "ng", ...ngArgs, ...defineFlags], {
  stdio: "inherit",
  shell: true,
  cwd: ROOT
});

process.exit(result.status ?? 1);
