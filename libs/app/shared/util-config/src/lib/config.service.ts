import { inject, InjectionToken, isDevMode, Signal, signal } from "@angular/core";

export type ConfigOptions = Record<string, unknown>;
export const CONFIG_OPTIONS = new InjectionToken<ConfigOptions>("CONFIG_OPTIONS");

export function injectConfig<T extends ConfigOptions>(token: InjectionToken<T>): T {
  return inject(token);
}

export class ConfigService<T extends object = ConfigOptions> {
  private readonly options = inject(CONFIG_OPTIONS) as unknown as T;

  public get<K extends keyof T>(key: K): T[K] | undefined {
    if (isDevMode() && !(key in this.options)) {
      console.warn(`[ConfigService] Key "${String(key)}" is missing from configuration`);
    }
    return this.options[key];
  }

  public select<K extends keyof T>(key: K): Signal<T[K] | undefined> {
    return signal(this.get(key));
  }

  public getOrDefault<K extends keyof T>(key: K, fallback: T[K]): T[K] {
    return this.options[key] ?? fallback;
  }
}
