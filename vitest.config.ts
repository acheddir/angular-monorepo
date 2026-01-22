import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@app/shell": resolve(__dirname, "libs/app/shell/feature-shell/src/public-api.ts"),
      "@app/home/welcome": resolve(__dirname, "libs/app/home/feature-welcome/src/public-api.ts"),
      "@app/layouts": resolve(__dirname, "libs/app/layouts/ui-layouts/src/public-api.ts"),
      "@app/layouts/navigation": resolve(
        __dirname,
        "libs/app/layouts/ui-navigation/src/public-api.ts"
      ),
      "@app/home/hero": resolve(__dirname, "libs/app/home/ui-hero/src/public-api.ts"),
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
