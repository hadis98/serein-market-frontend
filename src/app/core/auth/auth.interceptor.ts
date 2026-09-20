import { inject } from '@angular/core';

import { HttpInterceptorFn } from '@angular/common/http';

import { API_BASE_URL } from '../api/api.config';

import { AuthTokenService } from './auth-token.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(AuthTokenService);

  const token = tokenService.get();

  if (!token || !request.url.startsWith(API_BASE_URL)) {
    return next(request);
  }

  const authenticatedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authenticatedRequest);
};
