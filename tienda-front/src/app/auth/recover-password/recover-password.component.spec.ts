import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RecoverPasswordComponent } from './recover-password.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let router: jasmine.SpyObj<Router>;
  let navigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['findUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const navigationServiceSpy = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [RecoverPasswordComponent],
      providers: [
        FormBuilder,
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    navigationService = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.recoverPasswordForm.value).toEqual({
      email: '',
    });
  });

  it('should validate email field', () => {
    const emailControl = component.recoverPasswordForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalse();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should handle form submission successfully', () => {
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
    usersService.findUser.and.returnValue(of(mockUser));
    spyOn(window, 'alert');

    component.recoverPasswordForm.setValue({ email: 'valid@example.com' });
    component.onSubmit();

    expect(usersService.findUser).toHaveBeenCalledWith('valid@example.com');
    expect(window.alert).toHaveBeenCalledWith('Se ha enviado un enlace de recuperación de contraseña a su correo electrónico.');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error if email is not found', () => {
    usersService.findUser.and.returnValue(of(null));
    spyOn(window, 'alert');

    component.recoverPasswordForm.setValue({ email: 'notfound@example.com' });
    component.onSubmit();

    expect(usersService.findUser).toHaveBeenCalledWith('notfound@example.com');
    expect(window.alert).toHaveBeenCalledWith('El correo ingresado no está registrado en el sistema.');
  });

  it('should show error on service failure', () => {
    usersService.findUser.and.returnValue(throwError(() => new Error('Service error')));
    spyOn(window, 'alert');

    component.recoverPasswordForm.setValue({ email: 'valid@example.com' });
    component.onSubmit();

    expect(usersService.findUser).toHaveBeenCalledWith('valid@example.com');
    expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al procesar su solicitud. Intente nuevamente.');
  });

  it('should show error if form is invalid', () => {
    spyOn(window, 'alert');

    component.recoverPasswordForm.setValue({ email: 'invalid-email' });
    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Por favor ingrese un correo electrónico válido.');
  });

  it('should add navigation delay for links in AfterViewInit', () => {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', '/some-path');
    spyOn(document, 'querySelectorAll').and.returnValue([linkElement] as any);

    component.ngAfterViewInit();

    const event = new MouseEvent('click');
    linkElement.dispatchEvent(event);

    expect(navigationService.navigateWithDelay).toHaveBeenCalledWith('/some-path');
  });
});