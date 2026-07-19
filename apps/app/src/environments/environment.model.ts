import { EnvironmentProviders } from "@angular/core";
import { Provider as OpenFeatureProvider } from "@openfeature/web-sdk";

export interface EnvironmentConfig {
  production: boolean;
  featureFlagProvider: OpenFeatureProvider;
  providers: EnvironmentProviders[];
}
