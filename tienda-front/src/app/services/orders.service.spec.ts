import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrdersService } from './orders.service';
import { environment } from '../../environments/environment';
import { Order } from '../builder/order.builder';
import { OrderDetail } from '../builder/order-detail.builder';

describe('OrdersService', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdersService],
    });

    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear(); // Limpia localStorage antes de cada prueba
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay solicitudes pendientes
    localStorage.clear(); // Limpia localStorage después de cada prueba
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*it('should register a product in the cart', () => {
    const product = {
      idProduct: 1,
      product: 'Product 1',
      image: 'image.jpg',
      price: 100,
      quantity: 2,
      total: 200,
    };

    const result = service.registerCarts(
      product.idProduct,
      product.product,
      product.image,
      product.price,
      product.quantity,
      product.total
    );

    expect(result).toBeTrue();
    const carts = JSON.parse(localStorage.getItem('carts') || '[]');
    expect(carts.length).toBe(1);
    expect(carts[0]).toEqual(product);
  });

  it('should clear the cart', () => {
    localStorage.setItem('carts', JSON.stringify([{ idProduct: 1 }]));
    service.clearCart();
    expect(localStorage.getItem('carts')).toBeNull();
  });

  it('should remove a product from the cart', () => {
    localStorage.setItem('carts', JSON.stringify([{ idProduct: 1 }, { idProduct: 2 }]));
    service.removeFromCart(0);
    const carts = JSON.parse(localStorage.getItem('carts') || '[]');
    expect(carts.length).toBe(1);
    expect(carts[0].idProduct).toBe(2);
  });

  it('should register an order', () => {
    const order: Order = {
      id: 1,
      email: 'test@example.com',
      montoTotal: 200,
      fecha: '2024-12-09',
      estado: 1,
    };
  
    service.registerOrders(order).subscribe((response) => {
      expect(response).toEqual(order);
    });
  
    const req = httpMock.expectOne(`${environment.apiPedidos}/pedidos`);
    expect(req.request.method).toBe('POST');
    req.flush(order);
  });

  it('should register order details', () => {
    const orderDetails: OrderDetail = {
      idProducto: 1,
      precio: 100,
      cantidad: 2,
      montoTotal: 200,
    } as OrderDetail;

    service.registerOrderDetails(orderDetails).subscribe((response) => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiPedidos}/pedidos/detalles`);
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should update product stock', () => {
    const idProduct = 1;
    const cantidad = 5;

    service.updateStock(idProduct, cantidad).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(
      `${environment.apiPedidos}/productos/${idProduct}/stock?cantidad=${cantidad}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should format a date to DD-MM-YYYY', () => {
    const result = (service as any).formatToFormDate('2024-12-09');
    expect(result).toBe('09-12-2024');
  });

  it('should format a date to YYYY-MM-DD', () => {
    const result = (service as any).formatToStorageDate('09-12-2024');
    expect(result).toBe('2024-12-09');
  });

  it('should handle unavailable localStorage', () => {
    spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');
    const result = (service as any).isLocalStorageAvailable();
    expect(result).toBeFalse();
  });

  it('should show an alert in the DOM', () => {
    document.body.innerHTML = '<div class="container"></div>';
    (service as any).mostrarAlerta('Test alert', 'success');
    const alertElement = document.querySelector('.alert.alert-success');
    expect(alertElement).toBeTruthy();
    expect(alertElement?.textContent).toContain('Test alert');
  });*/
});