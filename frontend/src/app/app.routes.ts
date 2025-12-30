import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'ces-users',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/ces-users/ces-user-list/ces-user-list.component').then(m => m.CesUserListComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent)
      },
      {
        path: 'customers/new',
        loadComponent: () => import('./features/customers/customer-create/customer-create.component').then(m => m.default)
      },
      {
        path: 'customers/:id',
        children: [
            { path: '', loadComponent: () => import('./features/customers/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent) },
            { path: 'catalog', loadComponent: () => import('./features/rewards/reward-catalog/reward-catalog.component').then(m => m.RewardCatalogComponent) },
            { path: 'cart', loadComponent: () => import('./features/rewards/cart/cart.component').then(m => m.CartComponent) },
            { path: 'history', loadComponent: () => import('./features/rewards/redemption-history/redemption-history.component').then(m => m.RedemptionHistoryComponent) }
        ]
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
