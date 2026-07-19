import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

const TENANT_ID_HEADER = "X-Tenant-Id";

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.url.startsWith("/");
  if (!isApiRequest) {
    return next(req);
  }

  const authService = inject(AuthService);
  const tenantId = authService.getTenantId();
  if (tenantId === null) {
    return next(req);
  }

  const tenantReq = req.clone({
    setHeaders: { [TENANT_ID_HEADER]: tenantId }
  });

  return next(tenantReq);
};
