import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { CartStore } from '../state/cart-store';

export const checkoutGuard: CanActivateFn = () => {
  const cart = inject(CartStore);
  const router = inject(Router);

  if (cart.isEmpty()) {
    return router.createUrlTree(['/cart']);
  }

  return true;
};
