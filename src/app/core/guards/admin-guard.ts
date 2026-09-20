import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../auth/auth-store';

export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthStore);

  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login'], {
      queryParams: {
        returnUrl: state.url,
      },
    });
  }

  if (!auth.isAdmin()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
