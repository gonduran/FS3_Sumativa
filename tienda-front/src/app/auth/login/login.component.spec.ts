import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { User, Rol } from '../../builder/user.builder';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRouter: Router;
  let mockActivatedRoute: any;

  // Roles de ejemplo
  const clientRole: Rol = { id: 3, nombre: 'Cliente' };
  const userRole: Rol = { id: 2, nombre: 'Usuario' };
  const adminRole: Rol = { id: 1, nombre: 'Administrador' };

  beforeEach(async () => {
    // Crear mocks
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['iniciarSesion', 'getLoggedInUser']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get')
        }
      },
      params: of({}),
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, 
        ReactiveFormsModule, 
        RouterTestingModule.withRoutes([]) // Configuración de rutas de prueba
      ],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: 'PLATFORM_ID', useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should validate form fields', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    // Probar validaciones de email
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('required')).toBeTruthy();

    emailControl?.setValue('invalidemail');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();

    // Probar validaciones de contraseña
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('required')).toBeTruthy();

    passwordControl?.setValue('password');
    expect(passwordControl?.valid).toBeTruthy();
  });

  describe('onSubmit method', () => {
    it('should not submit if form is invalid', () => {
      spyOn(console, 'log');
      spyOn(window, 'alert');

      component.loginForm.setValue({
        email: '',
        password: ''
      });

      component.onSubmit();

      expect(console.log).toHaveBeenCalledWith('Formulario inválido.');
      expect(window.alert).toHaveBeenCalledWith('Por favor, complete los campos correctamente.');
      expect(mockUsersService.iniciarSesion).not.toHaveBeenCalled();
    });

    describe('Successful Login Scenarios', () => {
      const validEmail = 'test@example.com';
      const validPassword = 'password123';

      beforeEach(() => {
        component.loginForm.setValue({
          email: validEmail,
          password: validPassword
        });
      });

      it('should navigate to profile for Client role', () => {
        const mockUser: User = {
          id: 1,
          nombre: 'John',
          apellido: 'Doe',
          email: validEmail,
          password: validPassword,
          fechaNacimiento: '1990-01-01',
          direccion: 'Test Address',
          roles: [clientRole]
        };

        mockUsersService.iniciarSesion.and.returnValue(of(true));
        mockUsersService.getLoggedInUser.and.returnValue(mockUser);

        spyOn(mockRouter, 'navigate');
        component.onSubmit();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
      });

      it('should navigate to list-product for User role', () => {
        const mockUser: User = {
          id: 1,
          nombre: 'Jane',
          apellido: 'Smith',
          email: validEmail,
          password: validPassword,
          fechaNacimiento: '1990-01-01',
          direccion: 'Test Address',
          roles: [userRole]
        };

        mockUsersService.iniciarSesion.and.returnValue(of(true));
        mockUsersService.getLoggedInUser.and.returnValue(mockUser);

        spyOn(mockRouter, 'navigate');
        component.onSubmit();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/list-product']);
      });

      it('should navigate to list-user for Admin role', () => {
        const mockUser: User = {
          id: 1,
          nombre: 'Admin',
          apellido: 'User',
          email: validEmail,
          password: validPassword,
          fechaNacimiento: '1990-01-01',
          direccion: 'Test Address',
          roles: [adminRole]
        };

        mockUsersService.iniciarSesion.and.returnValue(of(true));
        mockUsersService.getLoggedInUser.and.returnValue(mockUser);

        spyOn(mockRouter, 'navigate');
        component.onSubmit();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/list-user']);
      });

      it('should handle unknown role', () => {
        const mockUser: User = {
          id: 1,
          nombre: 'Unknown',
          apellido: 'User',
          email: validEmail,
          password: validPassword,
          fechaNacimiento: '1990-01-01',
          direccion: 'Test Address',
          roles: [{ id: 99, nombre: 'Unknown Role' }]
        };

        spyOn(console, 'warn');
        spyOn(window, 'alert');

        mockUsersService.iniciarSesion.and.returnValue(of(true));
        mockUsersService.getLoggedInUser.and.returnValue(mockUser);

        component.onSubmit();

        expect(console.warn).toHaveBeenCalledWith('Rol desconocido:', 99);
        expect(window.alert).toHaveBeenCalledWith('Rol desconocido, contacte al administrador.');
      });
    });

    describe('Login Error Scenarios', () => {
      const validEmail = 'test@example.com';
      const validPassword = 'password123';

      beforeEach(() => {
        component.loginForm.setValue({
          email: validEmail,
          password: validPassword
        });
      });

      it('should handle login failure', () => {
        spyOn(console, 'log');
        spyOn(window, 'alert');

        mockUsersService.iniciarSesion.and.returnValue(of(false));

        component.onSubmit();

        expect(console.log).toHaveBeenCalledWith('Error en el inicio de sesión.');
        expect(window.alert).toHaveBeenCalledWith('Email o contraseña incorrectos.');
      });

      it('should handle login error', () => {
        spyOn(console, 'error');
        spyOn(window, 'alert');

        mockUsersService.iniciarSesion.and.returnValue(throwError(() => new Error('Login error')));

        component.onSubmit();

        expect(console.error).toHaveBeenCalledWith('Error en el inicio de sesión:', jasmine.any(Error));
        expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al intentar iniciar sesión. Por favor, intente nuevamente.');
      });

      it('should handle missing logged in user', () => {
        spyOn(console, 'error');
        spyOn(window, 'alert');

        mockUsersService.iniciarSesion.and.returnValue(of(true));
        mockUsersService.getLoggedInUser.and.returnValue(null);

        component.onSubmit();

        expect(console.error).toHaveBeenCalledWith('No se pudo recuperar el usuario logueado.');
        expect(window.alert).toHaveBeenCalledWith('Error al recuperar la información del usuario. Por favor, inicie sesión nuevamente.');
      });
    });
  });
});