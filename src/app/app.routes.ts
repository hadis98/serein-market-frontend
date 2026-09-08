import { Routes } from '@angular/router';

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
    path: '**',
    redirectTo: 'products',
  },
];
