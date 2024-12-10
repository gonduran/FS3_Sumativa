import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['registerUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.registerForm;
      expect(form.valid).toBeFalsy();
      
      expect(form.get('name')?.errors?.['required']).toBeTruthy();
      expect(form.get('surname')?.errors?.['required']).toBeTruthy();
      expect(form.get('email')?.errors?.['required']).toBeTruthy();
      expect(form.get('password')?.errors?.['required']).toBeTruthy();
      expect(form.get('birthdate')?.errors?.['required']).toBeTruthy();
    });

    it('should validate name and surname length', () => {
      const nameControl = component.registerForm.get('name');
      const surnameControl = component.registerForm.get('surname');

      nameControl?.setValue('a');
      expect(nameControl?.errors?.['minlength']).toBeTruthy();
      nameControl?.setValue('John');
      expect(nameControl?.errors).toBeNull();

      surnameControl?.setValue('b');
      expect(surnameControl?.errors?.['minlength']).toBeTruthy();
      surnameControl?.setValue('Doe');
      expect(surnameControl?.errors).toBeNull();
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.errors?.['email']).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors).toBeNull();
    });

    it('should validate password format', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('weak');
      expect(passwordControl?.errors).toBeTruthy();

      passwordControl?.setValue('StrongPass1!');
      expect(passwordControl?.errors).toBeFalsy();
    });

    it('should validate password match', () => {
      component.registerForm.patchValue({
        password: 'StrongPass1!',
        confirmPassword: 'DifferentPass1!'
      });
      expect(component.registerForm.errors?.['mismatch']).toBeTruthy();

      component.registerForm.patchValue({
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!'
      });
      expect(component.registerForm.errors?.['mismatch']).toBeFalsy();
    });
  });

  describe('Age Calculation', () => {
    it('should calculate age correctly', () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 20;
      const birthdate = `${birthYear}-01-01`;
      expect(component.calculateAge(birthdate)).toBe(20);
    });

    it('should handle birthdate before birthday this year', () => {
      const today = new Date();
      const birthYear = today.getFullYear() - 20;
      const nextMonth = new Date(today.getTime());
      nextMonth.setMonth(today.getMonth() + 1);
      const futureMonth = nextMonth.getMonth() + 1;
      const futureMonthStr = futureMonth.toString().padStart(2, '0');
      const birthdate = `${birthYear}-${futureMonthStr}-01`;
      const expectedAge = today.getMonth() >= nextMonth.getMonth() ? 20 : 19;
      expect(component.calculateAge(birthdate)).toBe(expectedAge);
    });
  });

  describe('Form Operations', () => {
    it('should reset form', () => {
      component.registerForm.patchValue({
        name: 'Test',
        email: 'test@test.com'
      });
      component.onReset();
      expect(component.registerForm.get('name')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
    });
  });

  describe('Date Formatting', () => {
    it('should format date to storage format', () => {
      const formDate = '01-01-2023';
      const storageDate = component.formatToStorageDate(formDate);
      expect(storageDate).toBe('2023-01-01');
    });

    it('should format date to form format', () => {
      const storageDate = '2023-01-01';
      const formDate = component.formatToFormDate(storageDate);
      expect(formDate).toBe('01-01-2023');
    });
  });

  describe('Registration Process', () => {
    beforeEach(() => {
      component.registerForm.patchValue({
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        birthdate: '1990-01-01',
        dispatchAddress: 'Test Address'
      });
    });

    it('should not register if user is under 13', () => {
      spyOn(window, 'alert');
      const today = new Date();
      const birthYear = today.getFullYear() - 12;
      
      component.registerForm.patchValue({
        birthdate: `${birthYear}-01-01`
      });

      component.onSubmit();
      expect(window.alert).toHaveBeenCalledWith('Debe tener al menos 13 años para registrarse.');
    });

    it('should handle successful registration', () => {
      spyOn(window, 'alert');
      spyOn(console, 'log');
      mockUsersService.registerUser.and.returnValue(of(true));

      component.onSubmit();
      
      expect(mockUsersService.registerUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Registro exitoso!');
      expect(console.log).toHaveBeenCalledWith('Registro exitoso:', jasmine.any(Object));
    });

    it('should handle failed registration', () => {
      spyOn(window, 'alert');
      spyOn(console, 'log');
      mockUsersService.registerUser.and.returnValue(of(false));

      component.onSubmit();
      
      expect(console.log).toHaveBeenCalledWith('Error en el registro.');
      expect(window.alert).toHaveBeenCalledWith('Error en el registro. Es posible que el usuario ya exista.');
    });

    it('should handle registration error', () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');
      mockUsersService.registerUser.and.returnValue(throwError(() => new Error('Registration error')));

      component.onSubmit();
      
      expect(console.error).toHaveBeenCalledWith('Error inesperado en el registro:', jasmine.any(Error));
      expect(window.alert).toHaveBeenCalledWith('Ocurrió un error inesperado. Inténtelo nuevamente.');
    });

    it('should handle invalid form submission', () => {
      spyOn(window, 'alert');
      spyOn(console, 'log');
      component.registerForm.get('email')?.setValue('invalid-email');

      component.onSubmit();
      
      expect(console.log).toHaveBeenCalledWith('Formulario inválido');
      expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos correctamente.');
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
});

describe('RegisterComponent Server Platform', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['registerUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should not add event listeners on server platform', () => {
    fixture.detectChanges();
    component.ngAfterViewInit();
    expect(mockNavigationService.navigateWithDelay).not.toHaveBeenCalled();
  });
});