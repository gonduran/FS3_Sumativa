import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User, Rol } from '../builder/user.builder';
import { environment } from '../../environments/environment';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  const mockRol: Rol = { id: 1, nombre: 'Admin' };
  const mockUser: User = {
    id: 1,
    nombre: 'Test',
    apellido: 'User',
    email: 'test@example.com',
    password: 'password123',
    fechaNacimiento: '1990-01-01',
    direccion: 'Test Address',
    roles: [mockRol]
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'logout']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('userExists', () => {
    it('should check if user exists', () => {
      service.userExists('test@example.com').subscribe(exists => {
        expect(exists).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUsuarios}/exists?email=test@example.com`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should handle error when checking user existence', () => {
      service.userExists('test@example.com').subscribe(exists => {
        expect(exists).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUsuarios}/exists?email=test@example.com`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('registerUser', () => {
    it('should handle existing user error', () => {
      spyOn(document, 'querySelector').and.returnValue(document.createElement('div'));
      
      service.registerUser(
        mockUser.nombre,
        mockUser.apellido,
        mockUser.email,
        mockUser.password,
        mockUser.fechaNacimiento,
        mockUser.direccion,
        1
      ).subscribe(success => {
        expect(success).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUsuarios}/register`);
      const mockErrorResponse = {
        status: 400,
        statusText: 'Bad Request'
      };
      req.flush('Se encontró el usuario con email', mockErrorResponse);
    });

    it('should handle general error', () => {
      spyOn(document, 'querySelector').and.returnValue(document.createElement('div'));
      
      service.registerUser(
        mockUser.nombre,
        mockUser.apellido,
        mockUser.email,
        mockUser.password,
        mockUser.fechaNacimiento,
        mockUser.direccion,
        1
      ).subscribe(success => {
        expect(success).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUsuarios}/register`);
      const mockErrorResponse = {
        status: 500,
        statusText: 'Internal Server Error'
      };
      req.flush('Server Error', mockErrorResponse);
    });
});

  describe('updateUser', () => {
    it('should update user successfully', () => {
      spyOn(document, 'querySelector').and.returnValue(document.createElement('div'));
      spyOn(localStorage, 'setItem');
      
      service.updateUser(
        mockUser.id,
        mockUser.nombre,
        mockUser.apellido,
        mockUser.email,
        mockUser.password,
        mockUser.fechaNacimiento,
        mockUser.direccion,
        1
      ).subscribe(success => {
        expect(success).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUsuarios}/update/${mockUser.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockUser);
    });

    it('should handle user not found error', () => {
      spyOn(document, 'querySelector').and.returnValue(document.createElement('div'));
      
      service.updateUser(
        mockUser.id,
        mockUser.nombre,
        mockUser.apellido,
        mockUser.email,
        mockUser.password,
        mockUser.fechaNacimiento,
        mockUser.direccion,
        1
      ).subscribe(success => {
        expect(success).toBe(false);
      });
    
      const req = httpMock.expectOne(`${environment.apiUsuarios}/update/${mockUser.id}`);
      const mockErrorResponse = {
        status: 400,
        statusText: 'Bad Request'
      };
      req.flush('No se encontró el usuario', mockErrorResponse);
    });
  });

  describe('iniciarSesion', () => {
    it('should login successfully', () => {
      spyOn(document, 'querySelector').and.returnValue(document.createElement('div'));
      
      service.iniciarSesion(mockUser.email, mockUser.password).subscribe(success => {
        expect(success).toBe(true);
      });

      const req = httpMock.expectOne(
        `${environment.apiUsuarios}/login?usuario=${mockUser.email}&password=${mockUser.password}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockUser);
    });

    it('should handle invalid credentials', () => {
      spyOn(document, 'querySelector').and.returnValue(document.createElement('div'));
      
      service.iniciarSesion(mockUser.email, 'wrongpassword').subscribe(success => {
        expect(success).toBe(false);
      });

      const req = httpMock.expectOne(
        `${environment.apiUsuarios}/login?usuario=${mockUser.email}&password=wrongpassword`
      );
      req.error(new ErrorEvent('Network error'), { status: 401 });
    });
  });

  describe('localStorage operations', () => {
    it('should check localStorage availability', () => {
      expect(service.isLocalStorageAvailable()).toBe(true);
    });

    it('should handle localStorage errors', () => {
      spyOn(localStorage, 'setItem').and.throwError('Storage error');
      expect(service.isLocalStorageAvailable()).toBe(false);
    });

    it('should set and get login state', () => {
      spyOn(localStorage, 'setItem');
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
      
      service.setLoginState(mockUser);
      const state = service.getLoginState();
      
      expect(state).toEqual(mockUser);
    });

    it('should handle login state with unavailable localStorage', () => {
      spyOn(service, 'isLocalStorageAvailable').and.returnValue(false);
      
      service.setLoginState(mockUser);
      const state = service.getLoginState();
      
      expect(state).toBeNull();
    });
  });

  describe('User operations', () => {
    it('should get users successfully', () => {
      service.getUsers().subscribe(users => {
        expect(users).toEqual([mockUser]);
      });

      const req = httpMock.expectOne(`${environment.apiUsuarios}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockUser]);
    });

    it('should get user by id', () => {
      service.getUserById(1).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUsuarios}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should find user by email', () => {
      spyOn(document, 'querySelector').and.returnValue(document.createElement('div'));
      
      service.findUser('test@example.com').subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUsuarios}/find?email=test@example.com`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should delete user', () => {
      service.deleteUser(1).subscribe(success => {
        expect(success).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUsuarios}/delete/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(true);
    });
  });

  describe('User session management', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem');
    });
  
    it('should check login state', () => {
      (Storage.prototype.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUser));
      expect(service.checkLoginState()).toBe(true);
      
      (Storage.prototype.getItem as jasmine.Spy).and.returnValue(null);
      expect(service.checkLoginState()).toBe(false);
    });
  
    it('should handle logout', () => {
      spyOn(Storage.prototype, 'removeItem');
      service.logout();
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('loggedInUser');
      expect(authService.logout).toHaveBeenCalled();
    });
  
    it('should get logged in user email', () => {
      (Storage.prototype.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUser));
      const email = service.getLoggedInUserEmail();
      expect(email).toBe(mockUser.email);
    });
  
    it('should get logged in user', () => {
      (Storage.prototype.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUser));
      const user = service.getLoggedInUser();
      expect(user).toEqual(mockUser);
    });
  });
});