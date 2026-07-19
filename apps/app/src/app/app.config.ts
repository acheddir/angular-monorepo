import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideAuth } from "@app/shared/util-auth";
import { routes } from "@app/shell";
import { authConfig } from "./auth.config";
import { provideFeatureFlags } from "@app/shared/util-feature-flags";
import { environment } from "@app/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideAuth(authConfig),
    ...environment.providers,
    provideFeatureFlags(environment.featureFlagProvider)
  ]
};
