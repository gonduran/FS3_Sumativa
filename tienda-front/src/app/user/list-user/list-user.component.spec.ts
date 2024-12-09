import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListUserComponent } from './list-user.component';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User, Rol } from '../../builder/user.builder';
import { PLATFORM_ID } from '@angular/core';

describe('ListUserComponent', () => {
  let component: ListUserComponent;
  let fixture: ComponentFixture<ListUserComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const routes: Routes = [
    { path: 'login', component: {} as any },
    { path: '**', redirectTo: '' }
  ];

  const mockRol: Rol = { id: 1, nombre: 'ADMIN' };
  const mockUser: User = {
    id: 1,
    nombre: 'Test',
    apellido: 'User',
    email: 'test@test.com',
    password: 'password123',
    fechaNacimiento: '1990-01-01',
    direccion: 'Test Address',
    roles: [mockRol]
  };

  beforeEach(async () => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['getUsers', 'deleteUser']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateAuthentication']);

    await TestBed.configureTestingModule({
      imports: [
        ListUserComponent,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ListUserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockAuthService.validateAuthentication.and.returnValue(true);
    mockUsersService.getUsers.and.returnValue(of([mockUser]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Authentication', () => {
    it('should redirect to login if not authenticated', () => {
      mockAuthService.validateAuthentication.and.returnValue(false);
      spyOn(router, 'navigate');
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Users Loading', () => {
    beforeEach(() => {
      mockAuthService.validateAuthentication.and.returnValue(true);
    });
  
    it('should load users successfully', fakeAsync(() => {
      const mockUsers: User[] = [{
        id: 1,
        nombre: 'Test',
        apellido: 'User',
        email: 'test@test.com',
        password: 'password123',
        fechaNacimiento: '1990-01-01',
        direccion: 'Test Address',
        roles: [{ id: 1, nombre: 'ADMIN' }]
      }];
    
      mockUsersService.getUsers.and.returnValue(of({
        _embedded: {
          usuarioList: mockUsers
        }
      } as any));
    
      component.loadUsers();
      tick();
      fixture.detectChanges();
    
      expect(component.users.length).toBe(1);
      expect(component.users[0]?.id).toBe(1);
    }));
  });

  describe('Authentication', () => {
    it('should redirect to login if not authenticated', () => {
      mockAuthService.validateAuthentication.and.returnValue(false);
      spyOn(router, 'navigate');
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('User Management', () => {
    beforeEach(() => {
      mockAuthService.validateAuthentication.and.returnValue(true);
      component.users = [mockUser];
    });

    it('should log edit user action', () => {
      spyOn(console, 'log');
      component.editUser(mockUser);
      expect(console.log).toHaveBeenCalledWith('Editar usuario:', mockUser);
    });

    it('should delete user successfully', () => {
      spyOn(window, 'alert');
      mockUsersService.deleteUser.and.returnValue(of(true));

      component.deleteUser(1);

      expect(component.users.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Usuario con ID 1 eliminado.');
    });

    it('should handle failed user deletion', () => {
      spyOn(window, 'alert');
      mockUsersService.deleteUser.and.returnValue(of(false));

      component.deleteUser(1);

      expect(component.users.length).toBe(1);
      expect(window.alert).toHaveBeenCalledWith('Error al intentar eliminar el usuario con ID 1.');
    });

    it('should handle error during user deletion', () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');
      mockUsersService.deleteUser.and.returnValue(throwError(() => new Error('Delete error')));

      component.deleteUser(1);

      expect(console.error).toHaveBeenCalledWith('Error al eliminar el usuario:', jasmine.any(Error));
      expect(window.alert).toHaveBeenCalledWith('Error inesperado al eliminar el usuario con ID 1.');
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

describe('ListUserComponent Server Platform', () => {
  let component: ListUserComponent;
  let fixture: ComponentFixture<ListUserComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const routes: Routes = [
    { path: 'login', component: {} as any },
    { path: '**', redirectTo: '' }
  ];

  beforeEach(async () => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['getUsers']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateAuthentication']);

    await TestBed.configureTestingModule({
      imports: [
        ListUserComponent,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ListUserComponent);
    component = fixture.componentInstance;
  });

  it('should not add event listeners on server platform', () => {
    fixture.detectChanges();
    component.ngAfterViewInit();
    expect(mockNavigationService.navigateWithDelay).not.toHaveBeenCalled();
  });
});