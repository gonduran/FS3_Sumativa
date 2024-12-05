import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false); // Indica si el usuario está autenticado
  private userRole = new BehaviorSubject<number | null>(null); // Almacena el rol del usuario como un número

  constructor() {}

  /**
   * Realiza el inicio de sesión configurando el estado de autenticación y el rol.
   * 
   * @param role - Rol numérico del usuario
   */
  login(role: number): void {
    this.isAuthenticated.next(true);
    this.userRole.next(role);
  }

  /**
   * Cierra la sesión del usuario limpiando el estado de autenticación y el rol.
   */
  logout(): void {
    this.isAuthenticated.next(false);
    this.userRole.next(null);
  }

  /**
   * Retorna un observable que indica si el usuario está autenticado.
   * 
   * @return {Observable<boolean>}
   */
  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  /**
   * Retorna un observable con el rol numérico del usuario.
   * 
   * @return {Observable<number | null>}
   */
  getUserRole(): Observable<number | null> {
    return this.userRole.asObservable();
  }

  /**
   * Valida si el usuario está autenticado y tiene un rol válido.
   * 
   * @return {boolean}
   */
  validateAuthentication(): boolean {
    const isLoggedIn = this.isAuthenticated.getValue();
    const role = this.userRole.getValue();
  
    if (!isLoggedIn) {
      console.warn('Usuario no autenticado. Redirigiendo a la página de inicio de sesión.');
      return false;
    }
  
    if (role === null) {
      console.warn('Rol de usuario no definido. Redirigiendo a la página de inicio de sesión.');
      return false;
    }
  
    console.log(`Usuario autenticado con rol: ${role}`);
    return true;
  }
}