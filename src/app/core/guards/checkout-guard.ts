import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { CartStore } from '../state/cart-store';

export const checkoutGuard: CanActivateFn = async() => {
  const cart = inject(CartStore);
  const router = inject(Router);

  await cart.load();

  if (cart.isEmpty()) {
    return router.createUrlTree(['/cart']);
  }

  return true;
};
