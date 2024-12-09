import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { Renderer2, ElementRef, PLATFORM_ID } from '@angular/core';
import { of, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import * as common from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockElementRef: ElementRef;

  beforeEach(async () => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['iniciarSesion', 'getLoggedInUser']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['listen']);
    mockElementRef = new ElementRef(document.createElement('div'));

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Importar el componente standalone
        ReactiveFormsModule, // Manejo de formularios
        RouterTestingModule, // Simulación de enrutamiento
      ],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Renderer2, useValue: mockRenderer },
        { provide: ElementRef, useValue: mockElementRef },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Mockear `isPlatformBrowser`
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should mark email and password as required', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');

    expect(emailControl?.valid).toBeFalse();
    expect(passwordControl?.valid).toBeFalse();
  });

  it('should not submit the form if it is invalid', () => {
    spyOn(window, 'alert');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Por favor, complete los campos correctamente.');
  });

  it('should call iniciarSesion and navigate to the appropriate route on successful login', () => {
    const mockUser = {
      id: 1,
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
      roles: [{ id: 3, nombre: '' }],
      password: 'P4ssw0rd%', 
      fechaNacimiento: '', 
      direccion: '',
    };
    mockUsersService.iniciarSesion.and.returnValue(of(true));
    mockUsersService.getLoggedInUser.and.returnValue(mockUser);

    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    component.onSubmit();

    expect(mockUsersService.iniciarSesion).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should show an error alert if login fails', () => {
    spyOn(window, 'alert');
    mockUsersService.iniciarSesion.and.returnValue(of(false));

    component.loginForm.setValue({ email: 'test@example.com', password: 'wrong-password' });
    component.onSubmit();

    expect(mockUsersService.iniciarSesion).toHaveBeenCalledWith('test@example.com', 'wrong-password');
    expect(window.alert).toHaveBeenCalledWith('Email o contraseña incorrectos.');
  });

  it('should handle an error during the login process', () => {
    spyOn(window, 'alert');
    mockUsersService.iniciarSesion.and.returnValue(throwError(() => new Error('Network error')));

    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    component.onSubmit();

    expect(mockUsersService.iniciarSesion).toHaveBeenCalledWith('test@example.com', 'password');
    expect(window.alert).toHaveBeenCalledWith(
      'Ocurrió un error al intentar iniciar sesión. Por favor, intente nuevamente.'
    );
  });

  it('should prevent default behavior and call navigateWithDelay for links in the DOM', () => {
    const navigateSpy = spyOn(mockNavigationService, 'navigateWithDelay');
    const link = document.createElement('a');
    link.setAttribute('href', '/test-route');
    mockElementRef.nativeElement.appendChild(link);

    link.dispatchEvent(new MouseEvent('click'));
    expect(navigateSpy).toHaveBeenCalledWith('/test-route');
  });
});