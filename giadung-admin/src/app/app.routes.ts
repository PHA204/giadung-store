
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
    path: 'brands',
    loadComponent: () => import('./pages/brands-list/brands-list.component').then(m => m.BrandsListComponent)
  },
  {
    path: 'brands/add',
    loadComponent: () => import('./pages/brand-form/brand-form.component').then(m => m.BrandFormComponent)
  },
  {
    path: 'brands/edit/:id',
    loadComponent: () => import('./pages/brand-form/brand-form.component').then(m => m.BrandFormComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories-list/categories-list.component').then(m => m.CategoriesListComponent)
  },
  {
    path: 'categories/add',
    loadComponent: () => import('./pages/category-form/category-form.component').then(m => m.CategoryFormComponent)
  },
  {
    path: 'categories/edit/:id',
    loadComponent: () => import('./pages/category-form/category-form.component').then(m => m.CategoryFormComponent)
  },
  // Orders
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders-list/orders-list.component').then(m => m.OrdersListComponent)
  },
  {
    path: 'orders/add',
    loadComponent: () => import('./pages/order-form/order-form.component').then(m => m.OrderFormComponent)
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  },
  // Reviews
  {
    path: 'reviews',
    loadComponent: () => import('./pages/reviews-list/reviews-list.component').then(m => m.ReviewsListComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  },
];