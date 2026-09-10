import { Routes } from '@angular/router';
import { checkoutGuard } from './core/guards/checkout-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () => import('./features/wishlist/wishlist/wishlist').then((m) => m.Wishlist),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/orders/orders').then((m) => m.Orders),
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/account/order-details/order-details').then((m) => m.OrderDetails),
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
    canActivate: [checkoutGuard, authGuard],
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
