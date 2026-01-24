import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
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
});
