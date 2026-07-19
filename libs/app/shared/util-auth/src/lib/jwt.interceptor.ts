import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.url.startsWith("/");
  if (!isApiRequest) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  if (token === null) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};
