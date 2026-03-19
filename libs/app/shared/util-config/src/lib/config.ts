import { inject, InjectionToken, signal, Signal } from "@angular/core";

export type ConfigOptions = Record<string, unknown>;

export const CONFIG_OPTIONS = new InjectionToken<ConfigOptions>("ConfigOptions", {
  factory: () => ({})
});

export class ConfigService<T extends object = ConfigOptions> {
  private readonly _values = inject(CONFIG_OPTIONS) as unknown as T;
  private readonly _signals = new Map<keyof T, Signal<unknown>>();

  constructor() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) return Reflect.get(target, prop, receiver);
        return (target._values as Record<string | symbol, unknown>)[prop];
      }
    });
  }

  public get<K extends keyof T>(key: K): T[K] {
    return this._values[key];
  }

  public select<K extends keyof T>(key: K): Signal<T[K]> {
    if (!this._signals.has(key)) {
      this._signals.set(key, signal(this._values[key]));
    }
    return this._signals.get(key) as Signal<T[K]>;
  }
}
