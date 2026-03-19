import { EnvironmentProviders, isDevMode } from "@angular/core";
import { provideConfig } from "@app/shared/util-config";
import type { Config } from "@app/shared/types";

export type { Config };

export interface Environment {
  production: boolean;
  providers: EnvironmentProviders[];
}

export const environment: Environment = {
  production: !isDevMode(),
  providers: [
    provideConfig({
      apiUrl: process.env.APP_API_URL,
      apiPrefix: "/api/v1"
    })
  ]
};
