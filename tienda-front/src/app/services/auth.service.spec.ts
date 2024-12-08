import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isAuthenticated to true and userRole to the provided role on login', () => {
    service.login(1);
    service.isLoggedIn().subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeTrue();
    });
    service.getUserRole().subscribe((role) => {
      expect(role).toBe(1);
    });
  });

  it('should set isAuthenticated to false and userRole to null on logout', () => {
    service.login(1); // Simula un inicio de sesión
    service.logout();
    service.isLoggedIn().subscribe((isLoggedIn) => {
      expect(isLoggedIn).toBeFalse();
    });
    service.getUserRole().subscribe((role) => {
      expect(role).toBeNull();
    });
  });

  it('should validate authentication correctly', () => {
    service.login(2);
    expect(service.validateAuthentication()).toBeTrue();

    service.logout();
    expect(service.validateAuthentication()).toBeFalse();
  });

  it('should warn and return false if user is not logged in during validation', () => {
    spyOn(console, 'warn');
    expect(service.validateAuthentication()).toBeFalse();
    expect(console.warn).toHaveBeenCalledWith('Usuario no autenticado. Redirigiendo a la página de inicio de sesión.');
  });

  it('should warn and return false if role is null during validation', () => {
    spyOn(console, 'warn');
    service.login(null as unknown as number); // Forzamos un valor inválido para el rol
    expect(service.validateAuthentication()).toBeFalse();
    expect(console.warn).toHaveBeenCalledWith('Rol de usuario no definido. Redirigiendo a la página de inicio de sesión.');
  });

  it('should log the role when authenticated during validation', () => {
    spyOn(console, 'log');
    service.login(3);
    expect(service.validateAuthentication()).toBeTrue();
    expect(console.log).toHaveBeenCalledWith('Usuario autenticado con rol: 3');
  });
});