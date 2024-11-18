import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private userRole = new BehaviorSubject<string | null>(null);

  constructor() {}

  login(role: string): void {
    this.isAuthenticated.next(true);
    this.userRole.next(role);
  }

  logout(): void {
    this.isAuthenticated.next(false);
    this.userRole.next(null);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getUserRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }

  validateAuthentication(): boolean {
    const isLoggedIn = this.isAuthenticated.getValue();
    const role = this.userRole.getValue();
  
    if (!isLoggedIn) {
      console.warn('Usuario no autenticado. Redirigiendo a la página de inicio de sesión.');
      return false;
    }
  
    if (!role) {
      console.warn('Rol de usuario no definido. Redirigiendo a la página de inicio de sesión.');
      return false;
    }
  
    console.log(`Usuario autenticado con rol: ${role}`);
    return true;
  }
}