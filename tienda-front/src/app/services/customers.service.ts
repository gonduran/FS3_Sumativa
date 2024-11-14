import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { AuthService } from './auth.service';

interface Customer {
  clientName: string;
  clientSurname: string;
  email: string;
  password: string;
  birthdate: string;
  dispatchAddress: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private storageKey = 'customers';
  private customers: Customer[] = [];

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
      const customersSaved = localStorage.getItem('customers');
      this.customers = customersSaved ? JSON.parse(customersSaved) : [];
    } else {
      this.customers = [];
    }
  }

  /**
   * @description 
   * Registra un nuevo cliente.
   * 
   * @param {string} clientName - Nombre del cliente.
   * @param {string} clientSurname - Apellido del cliente.
   * @param {string} email - Correo electrónico del cliente.
   * @param {string} password - Contraseña del cliente.
   * @param {string} birthdate - Fecha de nacimiento del cliente.
   * @param {string} dispatchAddress - Dirección de envío del cliente.
   * @return {boolean} - Retorna true si el cliente fue registrado exitosamente, de lo contrario false.
   */
  registerCustomer(clientName: string, clientSurname: string, email: string, password: string, birthdate: string, dispatchAddress: string, rol: string): boolean {
    console.log('Intentando registrar cliente:', { clientName, clientSurname, email, birthdate, dispatchAddress, rol });
    const customerExisting = this.customers.find(customer => customer.email === email);
    if (customerExisting) {
      this.mostrarAlerta('El cliente ya existe.', 'danger');
      console.log('El cliente ya existe.');
      return false;
    }

    const newCustomer: Customer = { clientName, clientSurname, email, password, birthdate, dispatchAddress, rol };
    this.customers.push(newCustomer);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('customers', JSON.stringify(this.customers));
    }
    this.mostrarAlerta('Cliente registrado exitosamente.', 'success');
    console.log('Cliente registrado exitosamente:', newCustomer);
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
  updateCustomer(clientName: string, clientSurname: string, email: string, password: string, birthdate: string, dispatchAddress: string, rol: string): boolean {
    console.log('Intentando actualizar cliente:', { clientName, clientSurname, email, birthdate, dispatchAddress, rol });
    const customerExisting = this.customers.find(customer => customer.email === email);
    if (customerExisting) {
      const loggedInClient = JSON.parse(localStorage.getItem('loggedInClient') || 'null');
      const clientIndex = this.customers.findIndex(customer => customer.email === loggedInClient.email);
      if (clientIndex !== -1) {
        if (password === '') {
          console.log('Cliente no cambia su contraseña');
          const passwordSC = loggedInClient.password;
          this.customers[clientIndex] = { clientName: clientName, clientSurname: clientSurname, email: email, password: passwordSC, birthdate: birthdate, dispatchAddress: dispatchAddress, rol: rol };
        } else {
          console.log('Cliente cambia su contraseña');
          password = this.cryptoService.encrypt(password);
          this.customers[clientIndex] = { clientName: clientName, clientSurname: clientSurname, email: email, password: password, birthdate: birthdate, dispatchAddress: dispatchAddress, rol: rol };
        }
        localStorage.setItem('customers', JSON.stringify(this.customers));

        // Actualizar los datos del cliente logueado en localStorage
        localStorage.setItem('loggedInClient', JSON.stringify(this.customers[clientIndex]));

        this.mostrarAlerta('Cliente actualizado exitosamente.', 'success');
        console.log('Cliente actualizado exitosamente:', this.customers[clientIndex]);
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
    const customer = this.customers.find(customer => customer.email.trim() === email.trim() && this.cryptoService.decrypt(customer.password.trim()) === password.trim());
    if (customer) {
      this.mostrarAlerta('Inicio de sesión exitoso.', 'success');
      console.log('Inicio de sesión exitoso:', customer);
      this.setLoginState(customer);
      this.authService.login(customer.rol);
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
   * @param {any} customer - El cliente que ha iniciado sesión.
   */
  setLoginState(customer: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('loggedInClient', JSON.stringify(customer));
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
  findCustomer(email: string): boolean {
    console.log('Buscando cliente:', { email });
    const customer = this.customers.find(customer => customer.email === email);
    if (customer) {
      this.mostrarAlerta('Cliente encontrado.', 'success');
      console.log('Cliente encontrado:', customer);
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
   * @return {Customer[]} - Un array de objetos Customer.
   */
  getClients(): Customer[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  /**
   * @description 
   * Agrega un nuevo cliente a la lista y guarda en localStorage.
   * 
   * @param {Customer} client - El cliente a agregar.
   * @return {void}
   */
  addClient(client: Customer): void {
    const clients = this.getClients();
    clients.push(client);
    localStorage.setItem(this.storageKey, JSON.stringify(clients));
  }

  /**
   * @description 
   * Actualiza un cliente existente.
   * 
   * @param {number} index - El índice del cliente a actualizar.
   * @param {Customer} updatedClient - Los datos actualizados del cliente.
   * @return {void}
   */
  updateClient(index: number, updatedClient: Customer): void {
    const clients = this.getClients();
    clients[index] = updatedClient;
    localStorage.setItem(this.storageKey, JSON.stringify(clients));
  }

  /**
   * @description 
   * Elimina un cliente de la lista y de localStorage.
   * 
   * @param {number} index - El índice del cliente a eliminar.
   * @return {void}
   */
  deleteClient(index: number): void {
    const clients = this.getClients();
    clients.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(clients));
  }
}
