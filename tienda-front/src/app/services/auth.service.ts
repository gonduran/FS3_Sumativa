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
}