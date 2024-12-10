import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverPasswordComponent } from './recover-password.component';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../builder/user.builder';
import { PLATFORM_ID } from '@angular/core';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    nombre: 'Test',
    apellido: 'User',
    email: 'test@test.com',
    password: 'Password123!',
    fechaNacimiento: '1990-01-01',
    direccion: 'Test Address',
    roles: [{ id: 3, nombre: 'Cliente' }]
  };

  beforeEach(async () => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['findUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RecoverPasswordComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate required email', () => {
      const emailControl = component.recoverPasswordForm.get('email');
      expect(emailControl?.valid).toBeFalsy();
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.recoverPasswordForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.errors?.['email']).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors).toBeNull();
    });
  });

  describe('Link Navigation', () => {
    it('should handle link clicks', () => {
      const mockLink = document.createElement('a');
      mockLink.href = '/test-route';
      document.body.appendChild(mockLink);

      component.ngAfterViewInit();
      mockLink.click();

      expect(mockNavigationService.navigateWithDelay).toHaveBeenCalledWith('/test-route');
      document.body.removeChild(mockLink);
    });

    it('should not navigate if href is null', () => {
      const mockLink = document.createElement('a');
      document.body.appendChild(mockLink);

      component.ngAfterViewInit();
      mockLink.click();

      expect(mockNavigationService.navigateWithDelay).not.toHaveBeenCalled();
      document.body.removeChild(mockLink);
    });
  });

  describe('Password Recovery', () => {
    it('should recover password for existing user', () => {
      spyOn(window, 'alert');
      spyOn(console, 'log');
      mockUsersService.findUser.and.returnValue(of(mockUser));

      component.recoverPasswordForm.setValue({ email: 'test@test.com' });
      component.onSubmit();

      expect(mockUsersService.findUser).toHaveBeenCalledWith('test@test.com');
      expect(console.log).toHaveBeenCalledWith('Usuario encontrado:', mockUser);
      expect(window.alert).toHaveBeenCalledWith('Se ha enviado un enlace de recuperación de contraseña a su correo electrónico.');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle non-existing user', () => {
      spyOn(window, 'alert');
      spyOn(console, 'log');
      mockUsersService.findUser.and.returnValue(of(null));

      component.recoverPasswordForm.setValue({ email: 'nonexistent@test.com' });
      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith('El correo ingresado no está registrado en el sistema.');
      expect(console.log).toHaveBeenCalledWith('Usuario no encontrado.');
    });

    it('should handle service error', () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');
      mockUsersService.findUser.and.returnValue(throwError(() => new Error('Service error')));

      component.recoverPasswordForm.setValue({ email: 'test@test.com' });
      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Error al verificar el usuario:', jasmine.any(Error));
      expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al procesar su solicitud. Intente nuevamente.');
    });

    it('should handle invalid form submission', () => {
      spyOn(window, 'alert');
      spyOn(console, 'log');

      component.recoverPasswordForm.setValue({ email: 'invalid-email' });
      component.onSubmit();

      expect(console.log).toHaveBeenCalledWith('Formulario inválido');
      expect(window.alert).toHaveBeenCalledWith('Por favor ingrese un correo electrónico válido.');
      expect(mockUsersService.findUser).not.toHaveBeenCalled();
    });
  });
});

describe('RecoverPasswordComponent Server Platform', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['findUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RecoverPasswordComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should not add event listeners on server platform', () => {
    fixture.detectChanges();
    component.ngAfterViewInit();
    expect(mockNavigationService.navigateWithDelay).not.toHaveBeenCalled();
  });
});