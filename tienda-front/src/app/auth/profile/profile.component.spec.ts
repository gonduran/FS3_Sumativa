import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'updateUser',
      'isLocalStorageAvailable',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'validateAuthentication',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [ProfileComponent],
      providers: [
        FormBuilder,
        NavigationService,
        Renderer2,
        ElementRef,
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.profileForm.value).toEqual({
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      dispatchAddress: '',
    });
  });

  it('should validate password and confirmPassword match', () => {
    component.profileForm.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      birthdate: '1990-01-01',
      dispatchAddress: '123 Main St',
    });
    expect(component.profileForm.valid).toBeTrue();
  });

  it('should return mismatch error if passwords do not match', () => {
    component.profileForm.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Password1!',
      confirmPassword: 'Password2!',
      birthdate: '1990-01-01',
      dispatchAddress: '123 Main St',
    });
    const error = component.passwordMatchValidator(component.profileForm);
    expect(error).toEqual({ mismatch: true });
  });

  it('should redirect to login if not authenticated', () => {
    authService.validateAuthentication.and.returnValue(false);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load client data on initialization', () => {
    usersService.isLocalStorageAvailable.and.returnValue(true);
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({
        nombre: 'John',
        apellido: 'Doe',
        email: 'john@example.com',
        fechaNacimiento: '1990-01-01',
        direccion: '123 Main St',
      })
    );
    component.loadClientData();
    expect(component.profileForm.value).toEqual({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: '',
      confirmPassword: '',
      birthdate: '01-01-1990',
      dispatchAddress: '123 Main St',
    });
  });

  it('should reset form on reset', () => {
    component.profileForm.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      birthdate: '1990-01-01',
      dispatchAddress: '123 Main St',
    });
    component.onReset();
    expect(component.profileForm.value).toEqual({
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      dispatchAddress: '',
    });
  });

  it('should calculate age correctly', () => {
    const age = component.calculateAge('1990-01-01');
    expect(age).toBe(new Date().getFullYear() - 1990);
  });

  it('should format dates correctly', () => {
    const formattedDate = component.formatToFormDate('1990-01-01');
    expect(formattedDate).toBe('01-01-1990');

    const storageDate = component.formatToStorageDate('01-01-1990');
    expect(storageDate).toBe('1990-01-01');
  });

  it('should handle form submission successfully', () => {
    usersService.updateUser.and.returnValue(of(true));
    spyOn(window, 'alert');
    component.profileForm.setValue({
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      birthdate: '1990-01-01',
      dispatchAddress: '123 Main St',
    });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Actualización exitosa!');
  });

  it('should show an error if form is invalid on submission', () => {
    spyOn(window, 'alert');
    component.profileForm.setValue({
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      dispatchAddress: '',
    });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos correctamente.');
  });
});