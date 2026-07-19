import { Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { OpenFeature, ProviderEvents } from "@openfeature/web-sdk";

@Injectable({ providedIn: "root" })
export class FeatureFlagService {
  readonly #flags = new Map<string, WritableSignal<boolean>>();
  readonly #client = OpenFeature.getClient();

  constructor() {
    this.#client.addHandler(ProviderEvents.ConfigurationChanged, () => {
      for (const [key, sig] of this.#flags.entries()) {
        const newValue = this.#client.getBooleanValue(key, sig());
        if (newValue !== sig()) {
          sig.set(newValue);
        }
      }
    });
  }

  public flag(key: string, defaultValue = false): Signal<boolean> {
    const existing = this.#flags.get(key);
    if (existing) {
      return existing.asReadonly();
    }

    const value = this.#client.getBooleanValue(key, defaultValue);
    const sig = signal(value);
    this.#flags.set(key, sig);

    return sig.asReadonly();
  }
}
