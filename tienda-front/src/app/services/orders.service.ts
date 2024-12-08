import { Injectable } from '@angular/core';

interface Cart {
  product: number;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  email: string;
  id: number;
  total: number;
  fecha: Date;
  estado: string;
}

interface OrderDetail extends Cart {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private carts: Cart[] = [];
  private orders: Order[] = [];
  private orderdetails: OrderDetail[] = [];
  private orderStorageKey = 'orders';
  private orderDetailsStorageKey = 'orderdetails';

  /**
   * @description 
   * Constructor del servicio. Carga los carros de compra, órdenes y detalles de órdenes desde localStorage.
   * 
   */
  constructor() {
    if (this.isLocalStorageAvailable()) {
      const cartsSaved = localStorage.getItem('carts');
      this.carts = cartsSaved ? JSON.parse(cartsSaved) : [];
      const ordersSaved = localStorage.getItem('orders');
      this.orders = ordersSaved ? JSON.parse(ordersSaved) : [];
      const orderdetailsSaved = localStorage.getItem('orderdetails');
      this.orderdetails = orderdetailsSaved ? JSON.parse(orderdetailsSaved) : [];
      this.loadOrdersFromLocalStorage();
    } else {
      this.carts = [];
      this.orders = [];
      this.orderdetails = [];
    }
  }

  /**
   * @description 
   * Registra un nuevo producto en el carro de compra.
   * 
   * @param {number} product - El nombre del producto.
   * @param {string} image - La URL de la imagen del producto.
   * @param {number} price - El precio del producto.
   * @param {number} quantity - La cantidad del producto.
   * @param {number} total - El total del producto.
   * @return {boolean} - Retorna true si el producto fue registrado exitosamente en el carro, de lo contrario false.
   */
  registerCarts(product: number, image: string, price: number, quantity: number, total: number): boolean {
    console.log('Intentando registrar producto en carro compra:', { product, image, price, quantity, total });

    const newCart: Cart = { product, image, price, quantity, total };
    this.carts.push(newCart);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('carts', JSON.stringify(this.carts));
    }
    this.mostrarAlerta('Producto registrado exitosamente en carro compra.', 'success');
    console.log('Producto registrado exitosamente en carro compra:', newCart);
    return true;
  }

  /**
   * @description 
   * Limpia el carro de compra.
   * 
   * @return {void}
   */
  clearCart(): void {
    this.carts = [];
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('carts');
    }
  }

  /**
   * @description 
   * Elimina un producto del carro de compra.
   * 
   * @param {number} index - El índice del producto a eliminar.
   * @return {void}
   */
  removeFromCart(index: number): void {
    this.carts.splice(index, 1);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('carts', JSON.stringify(this.carts));
    }
  }

  /**
   * @description 
   * Registra una nueva orden.
   * 
   * @param {string} email - El correo electrónico del cliente.
   * @param {number} total - El total de la orden.
   * @return {number} - Retorna el ID de la nueva orden registrada.
   */
  registerOrders(email: string, total: number): number {
    console.log('Intentando registrar orden cliente:', { email, total });
    const fecha = new Date();
    const estado = 'Pendiente';
    const id = this.orders.length + 1;

    const newOrder: Order = { email, id, total, fecha, estado };
    this.orders.push(newOrder);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('orders', JSON.stringify(this.orders));
    }
    console.log('Orden cliente registrado exitosamente:', newOrder);
    return id;
  }

  /**
   * @description 
   * Registra los detalles de una orden.
   * 
   * @param {number} id - El ID de la orden.
   * @return {boolean} - Retorna true si los detalles de la orden fueron registrados exitosamente, de lo contrario false.
   */
  registerOrderdetails(id: number): boolean {
    if (this.isLocalStorageAvailable()) {
      const cart = JSON.parse(localStorage.getItem('carts') || '[]');
      const orderDetail = cart.map((item: any) => ({
        ...item,
        id: id
      }));

      const existingItems = JSON.parse(localStorage.getItem('orderdetails') || '[]');
      const updatedItems = existingItems.concat(orderDetail);
      
      localStorage.setItem('orderdetails', JSON.stringify(updatedItems));

      console.log('Detalle compra registrado exitosamente:', orderDetail);
      return true;
    }
    return false;
  }

  /**
   * @description 
   * Actualiza una orden existente.
   * 
   * @param {string} email - El correo electrónico del cliente.
   * @param {number} id - El ID de la orden.
   * @param {number} total - El total de la orden.
   * @param {string} estado - El estado de la orden.
   * @return {boolean} - Retorna true si la orden fue actualizada exitosamente, de lo contrario false.
   */
  updateOrders(email: string, id: number, total: number, estado: string): boolean {
    console.log('Intentando actualizar orden cliente:', { email, id });
    const orderExisting = this.orders.find(order => order.id === id);
    const fecha = new Date();

    if (orderExisting) {
      const orderIndex = this.orders.findIndex(contact => contact.id === id);
      if (orderIndex !== -1) {
        console.log('Se actualiza estado orden cliente');
        this.orders[orderIndex] = { email: email, id: id, total: total, fecha: fecha, estado : estado };
        localStorage.setItem('orders', JSON.stringify(this.orders));

        console.log('Orden cliente actualizado exitosamente:', this.orders[orderIndex]);
        return true;
      } else {
        console.log('Error al actualizar el orden cliente:', email);
        return false;
      } 
    }

    this.mostrarAlerta('Orden cliente no actualizado.', 'danger');
    console.log('Orden cliente no actualizado:', email);
    return false;
  }

  /**
   * @description 
   * Muestra una alerta en la interfaz de usuario.
   * 
   * @param {string} mensaje - El mensaje de la alerta.
   * @param {string} tipo - El tipo de alerta (e.g., 'success', 'danger').
   * @return {void}
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
  private isLocalStorageAvailable(): boolean {
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
   * Busca una orden por su ID.
   * 
   * @param {number} id - El ID de la orden.
   * @return {boolean} - Retorna true si la orden fue encontrada, de lo contrario false.
   */
  findOrder(id: number): boolean {
    console.log('Buscando orden cliente:', { id });
    const order = this.orders.find(order => order.id === id);
    if (order) {
      this.mostrarAlerta('Orden cliente encontrado.', 'success');
      console.log('Orden cliente encontrado:', order);
      return true;
    } else {
      this.mostrarAlerta('Orden cliente no encontrado.', 'danger');
      console.log('Orden cliente no encontrado.');
      return false;
    }
  }

  /**
   * @description 
   * Formatea una fecha en formato YYYY-MM-DD a DD-MM-YYYY.
   * 
   * @param {string} date - La fecha en formato YYYY-MM-DD.
   * @return {string} - La fecha formateada en formato DD-MM-YYYY.
   */
  private formatToFormDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  /**
   * @description 
   * Formatea una fecha en formato DD-MM-YYYY a YYYY-MM-DD.
   * 
   * @param {string} date - La fecha en formato DD-MM-YYYY.
   * @return {string} - La fecha formateada en formato YYYY-MM-DD.
   */
  private formatToStorageDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  /**
   * @description 
   * Carga las órdenes y los detalles de las órdenes desde el localStorage.
   * 
   * @return {void}
   */
  private loadOrdersFromLocalStorage(): void {
    const ordersSaved = localStorage.getItem(this.orderStorageKey);
    const orderDetailsSaved = localStorage.getItem(this.orderDetailsStorageKey);
    this.orders = ordersSaved ? JSON.parse(ordersSaved) : [];
    this.orderdetails = orderDetailsSaved ? JSON.parse(orderDetailsSaved) : [];
  }

  /**
   * @description 
   * Obtiene todas las órdenes.
   * 
   * @return {Order[]} Lista de órdenes.
   */
  getOrders(): Order[] {
    return this.orders;
  }

  /**
   * @description 
   * Obtiene los detalles de una orden específica.
   * 
   * @param {number} orderId - El ID de la orden.
   * @return {OrderDetail[]} Lista de detalles de la orden.
   */
  getOrderDetails(orderId: number): OrderDetail[] {
    return this.orderdetails.filter(detail => detail.id === orderId);
  }

  /**
   * @description 
   * Actualiza el estado de una orden.
   * 
   * @param {number} orderId - El ID de la orden.
   * @param {string} status - El nuevo estado de la orden.
   * @return {void}
   */
  updateOrderStatus(orderId: number, status: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.estado = status;
      this.saveOrdersToLocalStorage();
    }
  }

  /**
   * @description 
   * Guarda las órdenes en el localStorage.
   * 
   * @return {void}
   */
  saveOrdersToLocalStorage(): void {
    localStorage.setItem(this.orderStorageKey, JSON.stringify(this.orders));
  }
}