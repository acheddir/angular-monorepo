import { inject, Injectable, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { AuthConfig, OAuthService } from "angular-oauth2-oidc";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly oAuthService = inject(OAuthService);

  public readonly isAuthenticated: Signal<boolean> = toSignal(
    this.oAuthService.events.pipe(map(() => this.oAuthService.hasValidAccessToken())),
    { initialValue: this.oAuthService.hasValidAccessToken() }
  );

  public configure(config: AuthConfig): Promise<boolean> {
    this.oAuthService.configure(config);
    this.oAuthService.setupAutomaticSilentRefresh();
    return this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  public login(returnUrl?: string): void {
    this.oAuthService.initCodeFlow(returnUrl);
  }

  public async logout(): Promise<void> {
    await this.oAuthService.revokeTokenAndLogout();
  }

  public getAccessToken(): string | null {
    return this.oAuthService.getAccessToken() || null;
  }

  public getTenantId(): string | null {
    const token = this.getAccessToken();
    if (token == null) return null;

    const payload = this.decodeToken(token);
    const tenantId = payload?.["tenant_id"];
    return typeof tenantId === "string" ? tenantId : null;
  }

  public getPrivileges(): string[] {
    const token = this.getAccessToken();
    if (token == null) return [];

    const payload = this.decodeToken(token);
    const privileges = payload?.["privilege"];

    if (Array.isArray(privileges)) {
      return privileges as string[];
    }

    if (typeof privileges === "string") {
      return [privileges];
    }

    return [];
  }

  private decodeToken(token: string): Record<string, unknown> | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))) as Record<
        string,
        unknown
      >;
    } catch {
      return null;
    }
  }
}
