import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { AppConfig, appConfigSchema } from "./config.schema";
import { CONFIG_OPTIONS, ConfigService } from "./config.service";

export function provideConfig(values: AppConfig): EnvironmentProviders {
  const parsed = appConfigSchema.parse(values); // throws ZedError if invalid
  return makeEnvironmentProviders([ConfigService, { provide: CONFIG_OPTIONS, useValue: parsed }]);
}
