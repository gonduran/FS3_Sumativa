import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['updateUser', 'isLocalStorageAvailable']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateAuthentication']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: 'PLATFORM_ID', useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.profileForm;
      expect(form.valid).toBeFalsy();
      
      expect(form.get('name')?.errors?.['required']).toBeTruthy();
      expect(form.get('surname')?.errors?.['required']).toBeTruthy();
      expect(form.get('email')?.errors?.['required']).toBeTruthy();
      expect(form.get('birthdate')?.errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.profileForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.errors?.['email']).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.errors).toBeNull();
    });

    it('should validate name and surname minimum length', () => {
      const nameControl = component.profileForm.get('name');
      const surnameControl = component.profileForm.get('surname');

      nameControl?.setValue('a');
      expect(nameControl?.errors?.['minlength']).toBeTruthy();
      nameControl?.setValue('John');
      expect(nameControl?.errors?.['minlength']).toBeFalsy();

      surnameControl?.setValue('b');
      expect(surnameControl?.errors?.['minlength']).toBeTruthy();
      surnameControl?.setValue('Doe');
      expect(surnameControl?.errors?.['minlength']).toBeFalsy();
    });

    it('should validate password format', () => {
      const passwordControl = component.profileForm.get('password');
      
      passwordControl?.setValue('weak');
      expect(passwordControl?.errors).toBeTruthy();

      passwordControl?.setValue('StrongPass1!');
      expect(passwordControl?.errors).toBeFalsy();
    });

    it('should validate password match', () => {
      const form = component.profileForm;
      form.get('password')?.setValue('StrongPass1!');
      form.get('confirmPassword')?.setValue('DifferentPass1!');
      expect(form.hasError('mismatch')).toBeTruthy();

      form.get('confirmPassword')?.setValue('StrongPass1!');
      expect(form.hasError('mismatch')).toBeFalsy();
    });

    it('should allow empty passwords', () => {
      const form = component.profileForm;
      form.get('password')?.setValue('');
      form.get('confirmPassword')?.setValue('');
      expect(form.hasError('mismatch')).toBeFalsy();
    });
  });

  describe('Authentication and Navigation', () => {
    it('should redirect to login if not authenticated', () => {
      mockAuthService.validateAuthentication.and.returnValue(false);
      component.ngOnInit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set up link navigation on browser platform', () => {
      const mockLink = document.createElement('a');
      mockLink.href = '/test-route';
      document.body.appendChild(mockLink);

      component.ngAfterViewInit();
      mockLink.click();

      expect(mockNavigationService.navigateWithDelay).toHaveBeenCalledWith('/test-route');
      document.body.removeChild(mockLink);
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
      component.profileForm.patchValue({
        name: 'Test',
        email: 'test@test.com'
      });
      component.onReset();
      expect(component.profileForm.get('name')?.value).toBe('');
      expect(component.profileForm.get('email')?.value).toBe('');
    });

    it('should load client data when available', () => {
      const mockUserData = {
        id: 1,
        nombre: 'John',
        apellido: 'Doe',
        email: 'john@example.com',
        fechaNacimiento: '1990-01-01',
        direccion: 'Test Address'
      };

      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUserData));
      mockUsersService.isLocalStorageAvailable.and.returnValue(true);

      component.loadClientData();

      expect(component.profileForm.get('name')?.value).toBe('John');
      expect(component.profileForm.get('surname')?.value).toBe('Doe');
      expect(component.profileForm.get('email')?.value).toBe('john@example.com');
      expect(component.profileForm.get('dispatchAddress')?.value).toBe('Test Address');
    });

    it('should handle missing client data', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      mockUsersService.isLocalStorageAvailable.and.returnValue(true);
      spyOn(console, 'warn');

      component.loadClientData();
      expect(console.warn).toHaveBeenCalledWith('No se encontraron datos del usuario en localStorage.');
    });

    it('should handle localStorage error', () => {
      spyOn(localStorage, 'getItem').and.throwError('Storage error');
      mockUsersService.isLocalStorageAvailable.and.returnValue(true);
      spyOn(console, 'error');

      component.loadClientData();
      expect(console.error).toHaveBeenCalledWith('Error al cargar datos del cliente desde localStorage:', jasmine.any(Error));
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      mockUsersService.updateUser.and.returnValue(of(true));
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ id: 1 }));
    });

    it('should not submit if user is under 13', () => {
      spyOn(window, 'alert');
      const today = new Date();
      const birthYear = today.getFullYear() - 12;
      
      component.profileForm.patchValue({
        name: 'Test',
        surname: 'User',
        email: 'test@test.com',
        birthdate: `01-01-${birthYear}`,
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        dispatchAddress: 'Test Address'
      });

      component.profileForm.markAllAsTouched();
      component.onSubmit();
      expect(window.alert).toHaveBeenCalledWith('Debe tener al menos 13 años para actualizar el perfil.');
    });

    it('should handle successful update', () => {
      spyOn(window, 'alert');
      spyOn(console, 'log');

      component.profileForm.patchValue({
        name: 'Test',
        surname: 'User',
        email: 'test@test.com',
        birthdate: '01-01-1990',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        dispatchAddress: 'Test Address'
      });

      component.profileForm.markAllAsTouched();
      component.onSubmit();
      
      expect(mockUsersService.updateUser).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Actualización exitosa!');
      expect(console.log).toHaveBeenCalledWith('Actualización exitosa:', jasmine.any(Object));
    });

    it('should handle unsuccessful update', () => {
      spyOn(window, 'alert');
      spyOn(console, 'log');
      mockUsersService.updateUser.and.returnValue(of(false));

      component.profileForm.patchValue({
        name: 'Test',
        surname: 'User',
        email: 'test@test.com',
        birthdate: '01-01-1990',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        dispatchAddress: 'Test Address'
      });

      component.profileForm.markAllAsTouched();
      component.onSubmit();
      
      expect(console.log).toHaveBeenCalledWith('Error en la actualización.');
      expect(window.alert).toHaveBeenCalledWith('Error en la actualización. Verifique los datos e inténtelo nuevamente.');
    });

    it('should handle update error', () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');
      mockUsersService.updateUser.and.returnValue(throwError(() => new Error('Update failed')));

      component.profileForm.patchValue({
        name: 'Test',
        surname: 'User',
        email: 'test@test.com',
        birthdate: '01-01-1990',
        password: 'StrongPass1!',
        confirmPassword: 'StrongPass1!',
        dispatchAddress: 'Test Address'
      });

      component.profileForm.markAllAsTouched();
      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Error inesperado en la actualización:', jasmine.any(Error));
      expect(window.alert).toHaveBeenCalledWith('Ocurrió un error inesperado. Inténtelo nuevamente.');
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

  describe('User ID Retrieval', () => {
    it('should get user ID when available', () => {
      const mockUserData = { id: 123 };
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUserData));
      mockUsersService.isLocalStorageAvailable.and.returnValue(true);

      const userId = component.getIdUserData();
      expect(userId).toBe(123);
    });

    it('should handle missing user data for ID retrieval', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      mockUsersService.isLocalStorageAvailable.and.returnValue(true);
      spyOn(console, 'warn');

      const userId = component.getIdUserData();
      expect(userId).toBe(0);
      expect(console.warn).toHaveBeenCalledWith('No se encontraron datos del usuario en localStorage.');
    });

    it('should handle localStorage error in ID retrieval', () => {
      spyOn(localStorage, 'getItem').and.throwError('Storage error');
      mockUsersService.isLocalStorageAvailable.and.returnValue(true);
      spyOn(console, 'error');

      const userId = component.getIdUserData();
      expect(userId).toBe(0);
      expect(console.error).toHaveBeenCalledWith('Error al cargar datos del cliente desde localStorage:', jasmine.any(Error));
    });
  });
});