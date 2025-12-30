import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // If not admin, maybe redirect to dashboard or show unauthorized
  // For now, redirect to dashboard as a safe fallback
  return router.createUrlTree(['/dashboard']);
};
