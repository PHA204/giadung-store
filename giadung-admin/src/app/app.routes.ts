// giadung-admin/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users-list/users-list.component').then(m => m.UsersListComponent)
  },
  {
    path: 'users/add',
    loadComponent: () => import('./pages/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  {
    path: 'users/edit/:id',
    loadComponent: () => import('./pages/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products-list/products-list.component').then(m => m.ProductsListComponent)
  },
  {
    path: 'products/add',
    loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  },
  {
  path: 'brands',
  loadComponent: () => import('./pages/brands-list/brands-list.component').then(m => m.BrandsListComponent)
  }
];