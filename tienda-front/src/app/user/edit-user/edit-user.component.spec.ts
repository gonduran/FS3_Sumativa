import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserComponent } from './edit-user.component';
import { UsersService } from '../../services/users.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../builder/user.builder';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let router: Router;

  const mockUser: User = {
    id: 1,
    nombre: 'Test',
    apellido: 'User',
    email: 'test@example.com',
    password: 'password123',
    fechaNacimiento: '1990-01-01',
    direccion: 'Test Address',
    roles: [{ id: 1, nombre: 'ADMIN' }]
  };

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['getUserById', 'updateUser']);
    
    await TestBed.configureTestingModule({
      imports: [EditUserComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockUsersService.getUserById.and.returnValue(of(mockUser));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load user data on init', () => {
      mockUsersService.getUserById.and.returnValue(of(mockUser));
      fixture.detectChanges();
      
      expect(component.editUserForm.get('name')?.value).toBe(mockUser.nombre);
      expect(component.editUserForm.get('email')?.value).toBe(mockUser.email);
    });

    it('should handle error loading user data', () => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      mockUsersService.getUserById.and.returnValue(throwError(() => new Error('Load error')));
      
      fixture.detectChanges();

      expect(window.alert).toHaveBeenCalledWith('No se pudo cargar el usuario. Intente nuevamente.');
      expect(router.navigate).toHaveBeenCalledWith(['/list-user']);
    });

    it('should handle missing user id', () => {
      TestBed.resetTestingModule();
      
      const mockRouter = { navigate: jasmine.createSpy('navigate') };
      
      TestBed.configureTestingModule({
        imports: [EditUserComponent, ReactiveFormsModule, RouterTestingModule],
        providers: [
          { provide: UsersService, useValue: mockUsersService },
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: convertToParamMap({})
              }
            }
          }
        ]
      });
    
      fixture = TestBed.createComponent(EditUserComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/list-user']);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      mockUsersService.getUserById.and.returnValue(of(mockUser));
      fixture.detectChanges();
    });

    it('should validate required fields', () => {
      component.editUserForm.get('name')?.setValue('');
      component.editUserForm.get('surname')?.setValue('');
      expect(component.editUserForm.get('name')?.errors?.['required']).toBeTruthy();
      expect(component.editUserForm.get('surname')?.errors?.['required']).toBeTruthy();
    });

    it('should validate password format when provided', () => {
      const passwordControl = component.editUserForm.get('password');
      passwordControl?.setValue('weak');
      expect(passwordControl?.errors).toBeTruthy();

      passwordControl?.setValue('StrongPass1!');
      expect(passwordControl?.errors).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      mockUsersService.getUserById.and.returnValue(of(mockUser));
      fixture.detectChanges();
    });

    it('should update user successfully', () => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      mockUsersService.updateUser.and.returnValue(of(true));

      component.editUserForm.patchValue({
        name: 'Updated',
        surname: 'User',
        rol: 1
      });

      component.onSubmit();

      expect(mockUsersService.updateUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Usuario actualizado correctamente');
      expect(router.navigate).toHaveBeenCalledWith(['/list-user']);
    });

    it('should handle update failure', () => {
      spyOn(window, 'alert');
      mockUsersService.updateUser.and.returnValue(of(false));

      component.editUserForm.patchValue({
        name: 'Updated',
        surname: 'User',
        rol: 1
      });

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith('Error al actualizar el usuario.');
    });

    it('should handle update error', () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');
      mockUsersService.updateUser.and.returnValue(throwError(() => new Error('Update error')));

      component.editUserForm.patchValue({
        name: 'Updated',
        surname: 'User',
        rol: 1
      });

      component.onSubmit();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Ocurrió un error inesperado. Intente nuevamente.');
    });

    it('should handle invalid form submission', () => {
      spyOn(window, 'alert');
      component.editUserForm.get('name')?.setValue('');
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