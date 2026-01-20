import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@demo/shell": resolve(__dirname, "libs/demo/shell/feature-shell/src/public-api.ts"),
      "@demo/home/welcome": resolve(__dirname, "libs/demo/home/feature-welcome/src/public-api.ts"),
      "@demo/layouts": resolve(__dirname, "libs/demo/layouts/ui-layouts/src/public-api.ts"),
      "@demo/layouts/navigation": resolve(
        __dirname,
        "libs/demo/layouts/ui-navigation/src/public-api.ts"
      ),
      "@demo/home/hero": resolve(__dirname, "libs/demo/home/ui-hero/src/public-api.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["libs/**/*.spec.ts", "apps/**/*.spec.ts"],
    setupFiles: ["./test-setup.ts"],
    deps: {
      optimizer: {
        web: {
          include: ["@angular/**", "rxjs/**"],
        },
      },
    },
  },
});
