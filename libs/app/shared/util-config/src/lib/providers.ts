import { EnvironmentProviders, inject, makeEnvironmentProviders } from "@angular/core";
import { CONFIG_OPTIONS, ConfigOptions, ConfigService } from "./config";

export function provideConfig<T extends ConfigOptions>(values: T = {} as T): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: CONFIG_OPTIONS,
      useValue: values
    },
    ConfigService
  ]);
}

export function injectConfig<T extends ConfigOptions>(): ConfigService<T> & T {
  return inject(ConfigService) as unknown as ConfigService<T> & T;
}
