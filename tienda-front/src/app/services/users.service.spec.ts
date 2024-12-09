import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { environment } from '../../environments/environment';
import { User, UserBuilder } from '../builder/user.builder';
import { AuthService } from './auth.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const apiUrlUsuario = environment.apiUsuarios;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['login', 'logout']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService, { provide: AuthService, useValue: spy }]
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('userExists', () => {
    it('should return true if the user exists', () => {
      const email = 'test@example.com';
      service.userExists(email).subscribe((exists) => {
        expect(exists).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrlUsuario}/exists?email=${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false if the user does not exist', () => {
      const email = 'test@example.com';
      service.userExists(email).subscribe((exists) => {
        expect(exists).toBeFalse();
      });

      const req = httpMock.expectOne(`${apiUrlUsuario}/exists?email=${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });
  });

  describe('registerUser', () => {
    it('should register a new user successfully', () => {
      const newUser: User = new UserBuilder()
        .setNombre('John')
        .setApellido('Doe')
        .setEmail('john.doe@example.com')
        .setPassword('password')
        .setFechaNacimiento('2000-01-01')
        .setDireccion('123 Street')
        .setRoles([{ id: 1, nombre: 'Admin' }])
        .build();

      service.registerUser('John', 'Doe', 'john.doe@example.com', 'password', '2000-01-01', '123 Street', 1).subscribe((result) => {
        expect(result).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrlUsuario}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(newUser);
    });

    it('should handle registration error', () => {
      service.registerUser('John', 'Doe', 'john.doe@example.com', 'password', '2000-01-01', '123 Street', 1).subscribe((result) => {
        expect(result).toBeFalse();
      });

      const req = httpMock.expectOne(`${apiUrlUsuario}/register`);
      expect(req.request.method).toBe('POST');
      req.flush({ error: 'User already exists' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', () => {
      const updatedUser: User = new UserBuilder()
        .setId(1)
        .setNombre('John')
        .setApellido('Doe')
        .setEmail('john.doe@example.com')
        .setPassword('newPassword')
        .setFechaNacimiento('2000-01-01')
        .setDireccion('456 Avenue')
        .setRoles([{ id: 2, nombre: 'User' }])
        .build();

      service.updateUser(1, 'John', 'Doe', 'john.doe@example.com', 'newPassword', '2000-01-01', '456 Avenue', 2).subscribe((result) => {
        expect(result).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrlUsuario}/update/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });

    it('should handle update error', () => {
      service.updateUser(1, 'John', 'Doe', 'john.doe@example.com', 'newPassword', '2000-01-01', '456 Avenue', 2).subscribe((result) => {
        expect(result).toBeFalse();
      });

      const req = httpMock.expectOne(`${apiUrlUsuario}/update/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({ error: 'User not found' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('iniciarSesion', () => {
    it('should login the user successfully', () => {
      const email = 'john.doe@example.com';
      const password = 'password';
      const mockResponse = {
        id: 1,
        nombre: 'John',
        apellido: 'Doe',
        email: 'john.doe@example.com',
        roles: [{ id: 1, nombre: 'Admin' }]
      };

      service.iniciarSesion(email, password).subscribe((result) => {
        expect(result).toBeTrue();
        expect(authServiceSpy.login).toHaveBeenCalledWith(1);
      });

      const req = httpMock.expectOne(`${apiUrlUsuario}/login?usuario=${email}&password=${password}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const email = 'john.doe@example.com';
      const password = 'wrong-password';

      service.iniciarSesion(email, password).subscribe((result) => {
        expect(result).toBeFalse();
      });

      const req = httpMock.expectOne(`${apiUrlUsuario}/login?usuario=${email}&password=${password}`);
      expect(req.request.method).toBe('POST');
      req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should call logout on authService and clear localStorage', () => {
      spyOn(localStorage, 'removeItem');
      service.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('loggedInUser');
      expect(authServiceSpy.logout).toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('should fetch all users', () => {
      const mockUsers: User[] = [
        new UserBuilder().setId(1).setNombre('John').setApellido('Doe').build(),
        new UserBuilder().setId(2).setNombre('Jane').setApellido('Smith').build()
      ];

      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(apiUrlUsuario);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });
});