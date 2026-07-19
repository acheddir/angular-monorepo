import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer
} from "@angular/core";
import { OpenFeature, Provider as OpenFeatureProvider } from "@openfeature/web-sdk";

export const FEATURE_FLAG_PROVIDERS = new InjectionToken<OpenFeatureProvider>(
  "FEATURE_FLAG_PROVIDERS"
);

export function provideFeatureFlags(provider: OpenFeatureProvider): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FEATURE_FLAG_PROVIDERS, useValue: provider },
    provideAppInitializer(async (): Promise<void> => {
      try {
        await OpenFeature.setProviderAndWait(provider);
      } catch (err) {
        console.error("[util-feature-flags] Failed to initialize OpenFeature provider:", err);
      }
    })
  ]);
}
