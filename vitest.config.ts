import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

function loadAppEnv(mode: string): Record<string, string> {
  const env = loadEnv(mode, process.cwd(), "");
  const appEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (/^APP_/i.test(key)) appEnv[key] = value;
  }
  return appEnv;
}

export default defineConfig(({ mode }) => {
  return {
    define: {
      "process.env": JSON.stringify(loadAppEnv(mode))
    },
    plugins: [tsconfigPaths()],
    test: {
      globals: true,
      environment: "jsdom",
      include: ["libs/**/*.spec.ts", "apps/**/*.spec.ts"],
      setupFiles: ["./test-setup.ts"],
      deps: {
        optimizer: {
          web: {
            include: ["@angular/**", "rxjs/**"]
          }
        }
      }
    }
  };
});
