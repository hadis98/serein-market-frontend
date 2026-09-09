import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../auth/auth-store';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      returnUrl: state.url,
    },
  });
};
