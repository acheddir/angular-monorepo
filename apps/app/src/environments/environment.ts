import { isDevMode } from "@angular/core";
import { EnvironmentConfig } from "./environment.model";
import { provideConfig } from "@app/shared/util-config";
import { TypedInMemoryProvider } from "@openfeature/web-sdk";
import type { Config } from "@app/shared/types";

export type { Config };

const flagsConfig = {
  permissions: {
    defaultVariant: "on",
    disabled: false,
    variants: {
      on: true,
      off: false
    }
  }
} as const;

export const environment: EnvironmentConfig = {
  production: !isDevMode(),
  featureFlagProvider: new TypedInMemoryProvider(flagsConfig),
  providers: [
    provideConfig({
      apiUrl: import.meta.env.APP_API_URL,
      environment: import.meta.env.APP_ENVIRONMENT,
      apiPrefix: "/api/v1"
    })
  ]
};
