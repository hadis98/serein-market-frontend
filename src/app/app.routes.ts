import { Routes } from '@angular/router';
import { checkoutGuard } from './core/guards/checkout-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products/products').then((m) => m.Products),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-details/product-details').then((m) => m.ProductDetails),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'checkout',
    canActivate: [checkoutGuard],
    loadComponent: () => import('./features/checkout/checkout/checkout').then((m) => m.Checkout),
  },
  {
    path: 'order-success',
    loadComponent: () =>
      import('./features/checkout/order-success/order-success').then((m) => m.OrderSuccess),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
