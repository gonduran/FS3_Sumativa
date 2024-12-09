import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { RegisterComponent } from './register.component';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let router: jasmine.SpyObj<Router>;
  let navigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['registerUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const navigationServiceSpy = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    navigationService = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.registerForm.value).toEqual({
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      dispatchAddress: '',
    });
  });

  it('should validate the form fields', () => {
    const form = component.registerForm;

    form.get('name')?.setValue('');
    expect(form.get('name')?.valid).toBeFalse();

    form.get('email')?.setValue('invalid-email');
    expect(form.get('email')?.valid).toBeFalse();

    form.get('password')?.setValue('weak');
    expect(form.get('password')?.valid).toBeFalse();

    form.get('password')?.setValue('Strong#123');
    expect(form.get('password')?.valid).toBeTrue();
  });

  it('should validate matching passwords', () => {
    const form = component.registerForm;

    form.get('password')?.setValue('Strong#123');
    form.get('confirmPassword')?.setValue('Strong#123');
    expect(component.passwordMatchValidator(form)).toBeNull();

    form.get('confirmPassword')?.setValue('Mismatch#123');
    expect(component.passwordMatchValidator(form)).toEqual({ mismatch: true });
  });

  it('should calculate age correctly', () => {
    const birthdate = '2000-01-01';
    const today = new Date();
    const expectedAge = today.getFullYear() - 2000;

    expect(component.calculateAge(birthdate)).toBe(expectedAge);
  });

  it('should show an alert if age is less than 13', () => {
    spyOn(window, 'alert');
    const form = component.registerForm;

    form.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Strong#123',
      confirmPassword: 'Strong#123',
      birthdate: '2020-01-01', // Age < 13
      dispatchAddress: '123 Main St',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Debe tener al menos 13 años para registrarse.');
  });

  it('should call registerUser on valid form submission', () => {
    spyOn(window, 'alert');
    const mockResponse = true;
    usersService.registerUser.and.returnValue(of(mockResponse));

    component.registerForm.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Strong#123',
      confirmPassword: 'Strong#123',
      birthdate: '2000-01-01',
      dispatchAddress: '123 Main St',
    });

    component.onSubmit();

    expect(usersService.registerUser).toHaveBeenCalledWith(
      'John',
      'Doe',
      'john@example.com',
      'Strong#123',
      '01-01-2000',
      '123 Main St',
      3
    );
    expect(window.alert).toHaveBeenCalledWith('Registro exitoso!');
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should handle registration error', () => {
    spyOn(window, 'alert');
    usersService.registerUser.and.returnValue(of(false));

    component.registerForm.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Strong#123',
      confirmPassword: 'Strong#123',
      birthdate: '2000-01-01',
      dispatchAddress: '123 Main St',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Error en el registro. Es posible que el usuario ya exista.');
  });

  it('should handle unexpected registration error', () => {
    spyOn(window, 'alert');
    usersService.registerUser.and.returnValue(throwError(() => new Error('Unexpected error')));

    component.registerForm.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Strong#123',
      confirmPassword: 'Strong#123',
      birthdate: '2000-01-01',
      dispatchAddress: '123 Main St',
    });

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error inesperado. Inténtelo nuevamente.');
  });

  it('should reset the form on onReset', () => {
    component.registerForm.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Strong#123',
      confirmPassword: 'Strong#123',
      birthdate: '2000-01-01',
      dispatchAddress: '123 Main St',
    });

    component.onReset();

    expect(component.registerForm.value).toEqual({
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      dispatchAddress: '',
    });
  });

  it('should handle navigation delay in ngAfterViewInit', () => {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', '/some-path');
    spyOn(document, 'querySelectorAll').and.returnValue([linkElement] as any);

    component.ngAfterViewInit();

    const event = new MouseEvent('click');
    linkElement.dispatchEvent(event);

    expect(navigationService.navigateWithDelay).toHaveBeenCalledWith('/some-path');
  });
});