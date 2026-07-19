import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
  EnvironmentProviders,
  importProvidersFrom,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer
} from "@angular/core";
import { AuthConfig, OAuthModule } from "angular-oauth2-oidc";
import { AuthService } from "./auth.service";
import { jwtInterceptor } from "./jwt.interceptor";
import { tenantInterceptor } from "./tenant.interceptor";

export function provideAuth(config: AuthConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(OAuthModule.forRoot()),
    provideHttpClient(withInterceptors([jwtInterceptor, tenantInterceptor])),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      return await authService.configure(config).catch((error: unknown) => {
        console.error("OIDC configuration failed: ", error);
        return true;
      });
    })
  ]);
}
