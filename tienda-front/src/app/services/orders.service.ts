import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderDetail, OrderDetailBuilder } from '../builder/order-detail.builder';
import { Order, OrderBuilder } from '../builder/order.builder';

interface Cart {
  idProduct: number;
  product: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private carts: Cart[] = [];
  private apiPedidosUrl = environment.apiPedidos;
  
  /**
   * @description 
   * Constructor del servicio. Carga los carros de compra, órdenes y detalles de órdenes desde localStorage.
   * 
   */
  constructor(private http: HttpClient) {
    if (this.isLocalStorageAvailable()) {
      const cartsSaved = localStorage.getItem('carts');
      this.carts = cartsSaved ? JSON.parse(cartsSaved) : [];
    } else {
      this.carts = [];
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
  registerCarts(idProduct: number, product: string, image: string, price: number, quantity: number, total: number): boolean {
    console.log('Intentando registrar producto en carro compra:', { product, image, price, quantity, total });

    const newCart: Cart = { idProduct, product, image, price, quantity, total };
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
    console.log('Carrito limpiado exitosamente.');
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
   * Registra una nueva orden en el backend.
   * @param order - Orden creada usando el patrón Builder.
   * @returns Observable con el ID de la orden creada.
   */
  registerOrders(order: Partial<Order>): Observable<Order> {
    console.log('Enviando orden al backend:', order);

    return this.http.post<Order>(`${this.apiPedidosUrl}/pedidos`, order);
  }

  /**
   * Registra los detalles de una orden en el backend.
   * @param orderDetails - Detalle de orden creados usando el patrón Builder.
   * @returns Observable<boolean> indicando éxito o fallo.
   */
  registerOrderDetails(orderDetails: OrderDetail): Observable<boolean> {
    console.log('Enviando detalles de orden al backend:', orderDetails);

    return this.http.post<boolean>(`${this.apiPedidosUrl}/pedidos/detalles`, orderDetails);
  }

  /**
   * Reduce el stock de un producto en el backend.
   * @param idProduct - ID del producto a actualizar.
   * @param quantity - Cantidad a rebajar del stock.
   * @returns Observable indicando éxito o fallo.
   */
  // Método para actualizar el stock
  updateStock(idProduct: number, cantidad: number) {
    const url = `${this.apiPedidosUrl}/productos/${idProduct}/stock?cantidad=${cantidad}`;
    return this.http.put(url, null);
  }
}