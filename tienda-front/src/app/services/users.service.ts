import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { AuthService } from './auth.service';
import { UserBuilder, User } from '../builder/user.builder';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private storageKey = 'users';
  private users: User[] = [];

  /**
   * @description 
   * Constructor del servicio. Carga los clientes desde localStorage.
   * 
   * @param {CryptoService} cryptoService - Servicio de encriptación.
   */
  constructor(private cryptoService: CryptoService,
    private authService: AuthService
  ) {
    if (this.isLocalStorageAvailable()) {
      const usersSaved = localStorage.getItem('users');
      this.users = usersSaved ? JSON.parse(usersSaved) : [];
    } else {
      this.users = [];
    }
    // Verifica y carga el usuario admin si no existe
    this.loadAdminUser();
  }

  private loadAdminUser(): void {
    if (this.isLocalStorageAvailable()) {
      const usersSaved = localStorage.getItem(this.storageKey);
      this.users = usersSaved ? JSON.parse(usersSaved) : [];
  
      const adminExists = this.users.some(user => user.rol === 'admin');
      if (!adminExists) {
        const adminUser: User = new UserBuilder()
          .setName('Admin')
          .setSurname('Tienda')
          .setEmail('admin@puente-magico.cl')
          .setPassword(this.cryptoService.encrypt('P4ss2511%'))
          .setBirthdate('01-01-2000')
          .setDispatchAddress('')
          .setRol('admin')
          .build();
        this.users.push(adminUser);
        localStorage.setItem(this.storageKey, JSON.stringify(this.users));
        console.log('Usuario admin cargado correctamente');
      }
    } else {
      console.warn('localStorage no está disponible');
    }
  }

  /**
   * @description 
   * Registra un nuevo cliente.
   * 
   * @param {string} name - Nombre del cliente.
   * @param {string} surname - Apellido del cliente.
   * @param {string} email - Correo electrónico del cliente.
   * @param {string} password - Contraseña del cliente.
   * @param {string} birthdate - Fecha de nacimiento del cliente.
   * @param {string} dispatchAddress - Dirección de envío del cliente.
   * @return {boolean} - Retorna true si el cliente fue registrado exitosamente, de lo contrario false.
   */
  registerUser(
    name: string,
    surname: string,
    email: string,
    password: string,
    birthdate: string,
    dispatchAddress: string,
    rol: string
  ): boolean {
    console.log('Intentando registrar cliente:', { name, surname, email, birthdate, dispatchAddress, rol });
    const userExisting = this.users.find(user => user.email === email);
    if (userExisting) {
      this.mostrarAlerta('El cliente ya existe.', 'danger');
      console.log('El cliente ya existe.');
      return false;
    }

    const newUser: User = new UserBuilder()
      .setName(name)
      .setSurname(surname)
      .setEmail(email)
      .setPassword(password)
      .setBirthdate(birthdate)
      .setDispatchAddress(dispatchAddress)
      .setRol(rol)
      .build();

    this.users.push(newUser);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    this.mostrarAlerta('Cliente registrado exitosamente.', 'success');
    console.log('Cliente registrado exitosamente:', newUser);
    return true;
  }

  /**
   * @description 
   * Actualiza un cliente existente.
   * 
   * @param {string} clientName - Nombre del cliente.
   * @param {string} clientSurname - Apellido del cliente.
   * @param {string} email - Correo electrónico del cliente.
   * @param {string} password - Contraseña del cliente.
   * @param {string} birthdate - Fecha de nacimiento del cliente.
   * @param {string} dispatchAddress - Dirección de envío del cliente.
   * @return {boolean} - Retorna true si el cliente fue actualizado exitosamente, de lo contrario false.
   */
  updateUser(
    name: string,
    surname: string,
    email: string,
    password: string,
    birthdate: string,
    dispatchAddress: string,
    rol: string
  ): boolean {
    console.log('Intentando actualizar cliente:', { name, surname, email, birthdate, dispatchAddress, rol });
    const userExisting = this.users.find(user => user.email === email);
    if (userExisting) {
      const loggedInClient = JSON.parse(localStorage.getItem('loggedInClient') || 'null');
      const clientIndex = this.users.findIndex(user => user.email === loggedInClient.email);
      if (clientIndex !== -1) {
        const passwordToUse = password ? this.cryptoService.encrypt(password) : loggedInClient.password;
        const updatedUser = new UserBuilder()
          .setName(name)
          .setSurname(surname)
          .setEmail(email)
          .setPassword(passwordToUse)
          .setBirthdate(birthdate)
          .setDispatchAddress(dispatchAddress)
          .setRol(rol)
          .build();

        this.users[clientIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('loggedInClient', JSON.stringify(updatedUser));

        this.mostrarAlerta('Cliente actualizado exitosamente.', 'success');
        console.log('Cliente actualizado exitosamente:', updatedUser);
        return true;
      } else {
        this.mostrarAlerta('Error al actualizar el perfil cliente.', 'danger');
        console.log('Error al actualizar el perfil cliente:', email);
        return false;
      }
    }
    this.mostrarAlerta('Cliente no actualizado.', 'danger');
    console.log('Cliente no actualizado:', email);
    return false;
  }

  /**
   * @description 
   * Inicia sesión de un cliente.
   * 
   * @param {string} email - Correo electrónico del cliente.
   * @param {string} password - Contraseña del cliente.
   * @return {boolean} - Retorna true si el inicio de sesión fue exitoso, de lo contrario false.
   */
  iniciarSesion(email: string, password: string): boolean {
    console.log('Intentando iniciar sesión:', { email, password });
    const user = this.users.find(user => user.email.trim() === email.trim() && this.cryptoService.decrypt(user.password.trim()) === password.trim());
    if (user) {
      this.mostrarAlerta('Inicio de sesión exitoso.', 'success');
      console.log('Inicio de sesión exitoso:', user);
      this.setLoginState(user);
      this.authService.login(user.rol);
      return true;
    } else {
      this.mostrarAlerta('Email o contraseña incorrectos.', 'danger');
      console.log('Email o contraseña incorrectos.');
      return false;
    }
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
   * Establece el estado de inicio de sesión del cliente.
   * 
   * @param {any} user - El cliente que ha iniciado sesión.
   */
  setLoginState(user: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('loggedInClient', JSON.stringify(user));
    }
  }

  /**
   * @description 
   * Verifica el estado de inicio de sesión del cliente.
   * 
   * @return {boolean} - Retorna true si el cliente ha iniciado sesión, de lo contrario false.
   */
  checkLoginState(): boolean {
    if (this.isLocalStorageAvailable()) {
      const loggedInClient = JSON.parse(localStorage.getItem('loggedInClient') || 'null');
      return loggedInClient !== null;
    }
    return false;
  }

  /**
   * @description 
   * Obtiene el correo electrónico del cliente logueado.
   * 
   * @return {string} - Retorna el correo electrónico del cliente logueado.
   */
  getLoggedInClientEmail(): string {
    if (this.isLocalStorageAvailable()) {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInClient') || '');
      return loggedInUser ? loggedInUser.email : '';
    }
    return '';
  }

  getLoggedInClient(): User | null {
    if (this.isLocalStorageAvailable()) {
      const loggedInUser = localStorage.getItem('loggedInClient');
      return loggedInUser ? JSON.parse(loggedInUser) : null;
    }
    return null;
  }

  /**
   * @description 
   * Cierra la sesión del cliente.
   * 
   */
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      console.log('Logout cliente.');
      localStorage.removeItem('loggedInClient');
      this.authService.logout();
    }
  }

  /**
   * @description 
   * Busca un cliente por su correo electrónico.
   * 
   * @param {string} email - El correo electrónico del cliente.
   * @return {boolean} - Retorna true si el cliente fue encontrado, de lo contrario false.
   */
  findUser(email: string): boolean {
    console.log('Buscando cliente:', { email });
    const user = this.users.find(user => user.email === email);
    if (user) {
      this.mostrarAlerta('Cliente encontrado.', 'success');
      console.log('Cliente encontrado:', user);
      return true;
    } else {
      this.mostrarAlerta('Cliente no encontrado.', 'danger');
      console.log('Cliente no encontrado.');
      return false;
    }
  }

  /**
   * @description 
   * Obtiene la lista de todos los clientes.
   * 
   * @return {User[]} - Un array de objetos User.
   */
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  /**
   * @description 
   * Agrega un nuevo cliente a la lista y guarda en localStorage.
   * 
   * @param {User} client - El cliente a agregar.
   * @return {void}
   */
  addClient(client: User): void {
    const users = this.getUsers();
    users.push(client);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  /**
   * @description 
   * Actualiza un cliente existente.
   * 
   * @param {number} index - El índice del cliente a actualizar.
   * @param {User} updatedClient - Los datos actualizados del cliente.
   * @return {void}
   */
  updateClient(index: number, updatedClient: User): void {
    const users = this.getUsers();
    users[index] = updatedClient;
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  /**
   * @description 
   * Elimina un cliente de la lista y de localStorage.
   * 
   * @param {number} index - El índice del cliente a eliminar.
   * @return {void}
   */
  deleteClient(index: number): void {
    const users = this.getUsers();
    users.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }
}
