import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserComponent } from './add-user.component';
import { UsersService } from '../../services/users.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let router: Router;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['registerUser']);
    
    await TestBed.configureTestingModule({
      imports: [AddUserComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: UsersService, useValue: mockUsersService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      expect(component.addUserForm.valid).toBeFalsy();
      expect(component.addUserForm.get('name')?.errors?.['required']).toBeTruthy();
      expect(component.addUserForm.get('surname')?.errors?.['required']).toBeTruthy();
      expect(component.addUserForm.get('email')?.errors?.['required']).toBeTruthy();
      expect(component.addUserForm.get('password')?.errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.addUserForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.errors?.['email']).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors).toBeNull();
    });

    it('should validate password format', () => {
      const passwordControl = component.addUserForm.get('password');
      passwordControl?.setValue('weak');
      expect(passwordControl?.errors).toBeTruthy();

      passwordControl?.setValue('StrongPass1!');
      expect(passwordControl?.errors).toBeFalsy();
    });

    it('should validate name and surname length', () => {
      const nameControl = component.addUserForm.get('name');
      const surnameControl = component.addUserForm.get('surname');

      nameControl?.setValue('a');
      expect(nameControl?.errors?.['minlength']).toBeTruthy();
      nameControl?.setValue('John');
      expect(nameControl?.errors).toBeNull();

      surnameControl?.setValue('b');
      expect(surnameControl?.errors?.['minlength']).toBeTruthy();
      surnameControl?.setValue('Doe');
      expect(surnameControl?.errors).toBeNull();
    });
  });

  describe('Form Submission', () => {
    it('should register user successfully', () => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      mockUsersService.registerUser.and.returnValue(of(true));

      component.addUserForm.patchValue({
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'StrongPass1!',
        rol: '1'
      });

      component.onSubmit();

      expect(mockUsersService.registerUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Usuario registrado exitosamente');
      expect(router.navigate).toHaveBeenCalledWith(['/list-user']);
    });

    it('should handle registration failure', () => {
      spyOn(window, 'alert');
      mockUsersService.registerUser.and.returnValue(of(false));

      component.addUserForm.patchValue({
        name: 'John',
        surname: 'Doe',
        email: 'existing@example.com',
        password: 'StrongPass1!',
        rol: '1'
      });

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith('Error: el correo ya está registrado.');
    });

    it('should handle registration error', () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');
      mockUsersService.registerUser.and.returnValue(throwError(() => new Error('Registration error')));

      component.addUserForm.patchValue({
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'StrongPass1!',
        rol: '1'
      });

      component.onSubmit();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Ocurrió un error inesperado. Intente nuevamente.');
    });

    it('should handle invalid form submission', () => {
      spyOn(window, 'alert');
      component.onSubmit();
      expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos correctamente.');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to list', () => {
      spyOn(router, 'navigate');
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/list-user']);
    });
  });
});