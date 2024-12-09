import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';
import { OrderBuilder } from '../../builder/order.builder';
import { OrderDetailBuilder } from '../../builder/order-detail.builder';

interface CartItem {
  idProduct: number;
  product: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, AfterViewInit {
  idOrden: number = 0;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private usersService: UsersService,
    private ordersService: OrdersService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (event: Event) => {
          event.preventDefault();
          const target = event.target as HTMLElement;
          const href = target.getAttribute('href');
          if (href) {
            this.navigationService.navigateWithDelay(href);
          }
        });
      });
    }
  }

  cart: CartItem[] = [];
  totalAmount: number = 0;

  loadCart(): void {
    if (this.usersService.isLocalStorageAvailable()) {
      this.cart = JSON.parse(localStorage.getItem('carts') || '[]');
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.ordersService.removeFromCart(index);
    this.calculateTotal();
  }

  clearCart(): void {
    this.cart = [];
    this.ordersService.clearCart();
    this.calculateTotal();
  }

  checkout(): void {
    if (this.checkLoginStateCheckout()) {
      const email = this.usersService.getLoggedInUserEmail();
      const total = this.totalAmount;
      const cart: any[] = JSON.parse(localStorage.getItem('carts') || '[]');
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      const estado = 1; // nueva orden

      console.log('Iniciando proceso de checkout...');
      console.log('Carrito:', cart);

      if (cart.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de realizar el checkout.');
        return;
      }

      // Construir la orden usando el OrderBuilder
      const order = new OrderBuilder()
        .setEmail(email)
        .setMontoTotal(total)
        .setFecha(formattedDate)
        .setEstado(estado)
        .build();

      this.ordersService.registerOrders(order).subscribe({
        next: (responseOrder) => {
          console.log('Orden registrada en el backend:', responseOrder);

          // Extraer el ID de la orden
          const idOrden = responseOrder.id;
          this.idOrden = idOrden;

          // Recorrer los elementos del carrito e insertar uno a uno
          cart.forEach((item) => {
            const orderDetail = new OrderDetailBuilder()
              .setOrden({
                id: idOrden
              })
              .setIdProducto(item.idProduct)
              .setPrecio(item.price)
              .setCantidad(item.quantity)
              .setMontoTotal(item.total)
              .build();

            // Registrar detalle de la orden
            this.ordersService.registerOrderDetails(orderDetail).subscribe({
              next: () => {
                console.log(`Detalle registrado para la orden ${idOrden}`);

                // Llamar al servicio para actualizar el stock
                this.ordersService.updateStock(item.idProduct, item.quantity).subscribe({
                  next: () => {
                    console.log(`Stock actualizado para el producto ${item.idProduct}`);
                  },
                  error: (err) => {
                    console.error('Error al actualizar el stock:', err);
                    alert('Hubo un problema al actualizar el stock del producto.');
                  },
                });
              },
              error: (err) => {
                console.error('Error al registrar un detalle de la orden:', err);
                alert('Hubo un problema al registrar un detalle de la orden.');
              },
            });
          });

          alert('Orden completada exitosamente.');
          this.ordersService.clearCart();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error al registrar la orden:', err);
          alert('Hubo un problema al registrar la orden.');
        },
      });
    }
  }

  checkLoginStateCheckout(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (this.usersService.checkLoginState()) {
        //Esta logueado, se permite checkout
        console.log('Esta logueado, se permite checkout.');
        return true;
      } else {
        //No esta logueado, mo se permite checkout y se redirige al login
        console.log('No esta logueado, no se permite checkout y se redirige al login.');
        this.router.navigate(['/login']);
      }
    }
    return false;
  }
}