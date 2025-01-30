import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthRoute = route.pathFromRoot.some(r => {
      const path = r.url[0]?.path;
      return path === 'auth' || path === 'login' || path === 'register';
    });
    
    // Permitir acceso a rutas de auth
    if (isAuthRoute) {
      return true;
    }

    // Redirigir a login si no está autenticado
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    
    return true;
  }
}
