import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserBuilder, User } from '../builder/user.builder';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrlUsuario = environment.apiUsuarios;

  /**
   * @description 
   * Constructor del servicio. 
   * 
   * @param {CryptoService} cryptoService - Servicio de encriptación.
   */
  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {

  }

  /**
   * Verifica si existe un usuario con el email proporcionado.
   *
   * @param email El email del usuario a verificar.
   * @return Observable<boolean> - Retorna true si el usuario existe, de lo contrario false.
   */
  userExists(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    console.log('Verificando si el usuario existe con email:', email);
    return this.http.get<boolean>(`${this.apiUrlUsuario}/exists`, { params }).pipe(
      map((response: boolean) => {
        console.log('Respuesta del backend:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return of(false); // Manejo de errores, devolviendo `false`.
      })
    );
  }

  /**
   * @description 
   * Registra un nuevo usuario en el backend y maneja posibles errores.
   * 
   * @param name - Nombre del usuario.
   * @param surname - Apellido del usuario.
   * @param email - Correo del usuario.
   * @param password - Contraseña del usuario (se encripta antes de enviar).
   * @param birthdate - Fecha de nacimiento.
   * @param dispatchAddress - Dirección de envío.
   * @param roleId - Rol del usuario.
   * @return {Observable<boolean>} - Retorna true si el usuario fue registrado exitosamente, de lo contrario false.
   */
  registerUser(
    name: string,
    surname: string,
    email: string,
    password: string,
    birthdate: string,
    dispatchAddress: string,
    roleId: number
  ): Observable<boolean> {
    console.log('Intentando registrar usuario:', { name, surname, email, birthdate, dispatchAddress, roleId });

    const roleName = (() => {
      switch (roleId) {
        case 1:
          return 'Admin';
        case 2:
          return 'User';
        case 3:
          return 'Client';
        default:
          return 'Client'; // Valor predeterminado
      }
    })();

    const newUser: User = new UserBuilder()
      .setNombre(name)
      .setApellido(surname)
      .setEmail(email)
      .setPassword(password)
      .setFechaNacimiento(birthdate)
      .setDireccion(dispatchAddress)
      .setRoles([{
        id: roleId,
        nombre: roleName
      }])
      .build();

    console.log('Usuario que se intenta registrar:', newUser);

    return this.http.post<User>(`${this.apiUrlUsuario}/register`, newUser).pipe(
      map((response: User) => {
        console.log('Usuario registrado exitosamente:', response);
        this.mostrarAlerta('Usuario registrado exitosamente.', 'success');
        return true; // Indica éxito
      }),
      catchError((error) => {
        console.error('Error al registrar el usuario:', error);

        // Verificar si el error viene del backend indicando que el usuario ya existe
        if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('Se encontró el usuario con email')) {
          this.mostrarAlerta('El usuario ya existe.', 'danger');
        } else {
          this.mostrarAlerta('Ocurrió un error al registrar el usuario.', 'danger');
        }
        return of(false); // Indica falla
      })
    );
  }

  /**
   * @description 
   * Actualiza un usuario existente en el backend y maneja posibles errores.
   * 
   * @param id - ID del usuario a actualizar.
   * @param name - Nombre del usuario.
   * @param surname - Apellido del usuario.
   * @param email - Correo electrónico del usuario.
   * @param password - Contraseña del usuario.
   * @param birthdate - Fecha de nacimiento del usuario.
   * @param dispatchAddress - Dirección de envío del usuario.
   * @param roleId - ID del rol del usuario.
   * @return {Observable<boolean>} - Retorna true si el usuario fue actualizado exitosamente, de lo contrario false.
   */
  updateUser(
    id: number,
    name: string,
    surname: string,
    email: string,
    password: string,
    birthdate: string,
    dispatchAddress: string,
    roleId: number
  ): Observable<boolean> {
    console.log('Intentando actualizar usuario:', { id, name, surname, email, birthdate, dispatchAddress, roleId });

    const roleName = (() => {
      switch (roleId) {
        case 1:
          return 'Admin';
        case 2:
          return 'User';
        case 3:
          return 'Client';
        default:
          return 'Client'; // Valor predeterminado
      }
    })();
    
    const updatedUser: User = new UserBuilder()
      .setId(id)
      .setNombre(name)
      .setApellido(surname)
      .setEmail(email)
      .setPassword(password)
      .setFechaNacimiento(birthdate)
      .setDireccion(dispatchAddress)
      .setRoles([{
        id: roleId,
        nombre: roleName
      }])
      .build();

    console.log('Usuario que se intenta actualizar:', updatedUser);

    return this.http.put<User>(`${this.apiUrlUsuario}/update/${id}`, updatedUser).pipe(
      map((response: User) => {
        console.log('Usuario actualizado exitosamente:', response);
        localStorage.setItem('loggedInUser', JSON.stringify(response));
        this.mostrarAlerta('Usuario actualizado exitosamente.', 'success');
        return true; // Indica éxito
      }),
      catchError((error) => {
        console.error('Error al actualizar el usuario:', error);

        if (error.status === 400 && error.error && typeof error.error === 'string' && error.error.includes('No se encontró el usuario')) {
          this.mostrarAlerta('El usuario no existe.', 'danger');
        } else {
          this.mostrarAlerta('Ocurrió un error al actualizar el usuario.', 'danger');
        }
        return of(false); // Indica falla
      })
    );
  }

  /**
   * @description 
   * Inicia sesión de un usuario llamando al backend para la validación.
   * 
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   * @return {Observable<boolean>} - Retorna true si el inicio de sesión fue exitoso, de lo contrario false.
   */
  iniciarSesion(email: string, password: string): Observable<boolean> {
    console.log('Intentando iniciar sesión:', { email, password });

    // Crear los parámetros para enviar al backend
    const params = new HttpParams()
      .set('usuario', email)
      .set('password', password);

    return this.http.post<any>(`${this.apiUrlUsuario}/login`, null, { params }).pipe(
      map((response: any) => {
        console.log('Respuesta del backend:', response);

        // Construir el usuario utilizando UserBuilder
        const user = new UserBuilder()
          .setId(response.id)
          .setNombre(response.nombre)
          .setApellido(response.apellido)
          .setEmail(response.email)
          .setPassword('') // No se incluye la contraseña del backend por seguridad
          .setFechaNacimiento(response.fechaNacimiento || '') // Si aplica
          .setDireccion(response.direccion || '') // Si aplica
          .setRoles(response.roles || []) // Manejar roles enviados desde el backend
          .build();

        // Guardar el estado del usuario en el cliente
        this.setLoginState(user);
        this.authService.login(user.roles[0].id);

        this.mostrarAlerta('Inicio de sesión exitoso.', 'success');
        return true;
      }),
      catchError((error) => {
        console.error('Error al intentar iniciar sesión:', error);

        // Verificar si el error es de credenciales inválidas
        if (error.status === 401) {
          this.mostrarAlerta('Email o contraseña incorrectos.', 'danger');
        } else {
          this.mostrarAlerta('Ocurrió un error al intentar iniciar sesión.', 'danger');
        }

        return of(false);
      })
    );
  }

  /**
   * @description 
   * Muestra una alerta en la interfaz de usuario.
   * 
   * @param {string} mensaje - El mensaje de la alerta.
   * @param {string} tipo - El tipo de alerta (e.g., 'success', 'danger').
   */
  private mostrarAlerta(mensaje: string, tipo: string): void {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo}`;
    alertaDiv.appendChild(document.createTextNode(mensaje));
    const container = document.querySelector('.container');
    if (container) {
      const firstChild = container.firstChild;
      if (firstChild) {
        container.insertBefore(alertaDiv, firstChild);
      } else {
        container.appendChild(alertaDiv);
      }

      setTimeout(() => {
        const alerta = document.querySelector('.alert');
        if (alerta) {
          alerta.remove();
        }
      }, 6000);
    }
  }

  /**
   * @description 
   * Verifica si localStorage está disponible.
   * 
   * @return {boolean} - Retorna true si localStorage está disponible, de lo contrario false.
   */
  isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @description 
   * Establece el estado de inicio de sesión del usuario utilizando localStorage.
   * 
   * @param {any} user - El usuario que ha iniciado sesión.
   */
  setLoginState(user: any): void {
    if (this.isLocalStorageAvailable() && user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
  }

  /**
   * @description 
   * Obtiene el estado de inicio de sesión desde localStorage.
   * 
   * @return {any} - Retorna el usuario logueado o null si no hay sesión.
   */
  getLoginState(): any {
    if (this.isLocalStorageAvailable()) {
      const user = localStorage.getItem('loggedInUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  /**
   * @description 
   * Verifica el estado de inicio de sesión del usuario.
   * 
   * @return {boolean} - Retorna true si el usuario ha iniciado sesión, de lo contrario false.
   */
  checkLoginState(): boolean {
    if (this.isLocalStorageAvailable()) {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      return loggedInUser !== null;
    }
    return false;
  }

  /**
   * @description 
   * Obtiene el correo electrónico del usuario logueado.
   * 
   * @return {string} - Retorna el correo electrónico del usuario logueado.
   */
  getLoggedInUserEmail(): string {
    if (this.isLocalStorageAvailable()) {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '');
      return loggedInUser ? loggedInUser.email : '';
    }
    return '';
  }

  /**
   * @description 
   * Obtiene el usuario logueado.
   * 
   * @return {user} - Retorna el usuario logueado.
   */
  getLoggedInUser(): User | null {
    if (this.isLocalStorageAvailable()) {
      const loggedInUser = localStorage.getItem('loggedInUser');
      return loggedInUser ? JSON.parse(loggedInUser) : null;
    }
    return null;
  }

  /**
   * @description 
   * Cierra la sesión del usuario.
   * 
   */
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      console.log('Logout usuario.');
      localStorage.removeItem('loggedInUser');
      this.authService.logout();
    }
  }

  /**
   * @description
   * Busca un usuario por su correo electrónico utilizando el backend.
   *
   * @param {string} email - El correo electrónico del usuario.
   * @return {Observable<User | null>} - Retorna el usuario si se encuentra, de lo contrario null.
   */
  findUser(email: string): Observable<User | null> {
    const params = new HttpParams().set('email', email);
    console.log('Buscando usuario con email:', email);

    return this.http.get<User>(`${this.apiUrlUsuario}/find`, { params }).pipe(
      map((user: User) => {
        console.log('Usuario encontrado:', user);
        this.mostrarAlerta('Usuario encontrado.', 'success');
        return user; // Retorna el usuario encontrado
      }),
      catchError((error) => {
        console.error('Error al buscar el usuario:', error);
        this.mostrarAlerta('Usuario no encontrado.', 'danger');
        return of(null); // Devuelve `null` en caso de error
      })
    );
  }

  /**
   * @description
   * Obtiene la lista de todos los usuarios desde el backend.
   *
   * @return {Observable<User[]>} - Un Observable que emite un array de objetos User.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrlUsuario}`).pipe(
      map((response) => {
        console.log('Respuesta del backend:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los datos de un usuario por su ID.
   * @param id ID del usuario a obtener.
   * @return {Observable<User>} Un Observable con los datos del usuario.
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrlUsuario}/${id}`).pipe(
      map((response: User) => response),
      catchError((error) => {
        console.error('Error al obtener usuario:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * @description 
   * Elimina un usuario de la lista y de BD.
   * 
   * @param {number} id - El id del usuario a eliminar.
   * @return {Observable<boolean>}
   */
  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrlUsuario}/delete/${id}`);
  }
}