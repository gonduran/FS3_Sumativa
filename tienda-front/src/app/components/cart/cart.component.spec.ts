import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Order } from '../../builder/order.builder';
import { OrderDetail } from '../../builder/order-detail.builder';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let navigationServiceSpy: jasmine.SpyObj<NavigationService>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let ordersServiceSpy: jasmine.SpyObj<OrdersService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Define los mocks aquí
  const mockOrder: Order = {
    id: 1,
    email: 'test@example.com',
    montoTotal: 100,
    fecha: '2024-12-09',
    estado: 1,
  };

  const mockOrderDetail: OrderDetail = {
    id: 1,
    orden: { id: 1 },
    idProducto: 1,
    precio: 10,
    cantidad: 2,
    montoTotal: 20,
  };

  beforeEach(async () => {
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['isLocalStorageAvailable', 'getLoggedInUserEmail', 'checkLoginState', 'removeFromCart', 'clearCart']);
    ordersServiceSpy = jasmine.createSpyObj('OrdersService', ['removeFromCart', 'clearCart', 'registerOrders', 'registerOrderDetails', 'updateStock']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: OrdersService, useValue: ordersServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: 'PLATFORM_ID', useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on init', () => {
    usersServiceSpy.isLocalStorageAvailable.and.returnValue(true);
    localStorage.setItem('carts', JSON.stringify([{ idProduct: 1, product: 'test', price: 10, quantity: 1, total: 10, image: '' }]));
    component.ngOnInit();
    expect(component.cart.length).toBe(1);
    expect(component.totalAmount).toBe(10);
  });

  it('should calculate total amount', () => {
    component.cart = [
      { idProduct: 1, product: 'test1', price: 10, quantity: 1, total: 10, image: '' },
      { idProduct: 2, product: 'test2', price: 20, quantity: 2, total: 40, image: '' }
    ];
    component.calculateTotal();
    expect(component.totalAmount).toBe(50);
  });

  it('should remove item from cart', () => {
    component.cart = [
      { idProduct: 1, product: 'test1', price: 10, quantity: 1, total: 10, image: '' },
      { idProduct: 2, product: 'test2', price: 20, quantity: 2, total: 40, image: '' }
    ];
    component.removeFromCart(0);
    expect(component.cart.length).toBe(1);
    expect(component.totalAmount).toBe(40);
  });

  it('should clear cart', () => {
    component.cart = [
      { idProduct: 1, product: 'test1', price: 10, quantity: 1, total: 10, image: '' },
      { idProduct: 2, product: 'test2', price: 20, quantity: 2, total: 40, image: '' }
    ];
    component.clearCart();
    expect(component.cart.length).toBe(0);
    expect(component.totalAmount).toBe(0);
  });

  it('should checkout successfully', () => {
    usersServiceSpy.checkLoginState.and.returnValue(true);
    usersServiceSpy.getLoggedInUserEmail.and.returnValue('test@example.com');
    localStorage.setItem('carts', JSON.stringify([{ idProduct: 1, product: 'test', price: 10, quantity: 1, total: 10, image: '' }]));
    
    // Utiliza los mocks en las líneas corregidas
    ordersServiceSpy.registerOrders.and.returnValue(of(mockOrder));
    ordersServiceSpy.registerOrderDetails.and.returnValue(of(true));
    ordersServiceSpy.updateStock.and.returnValue(of({}));

    component.checkout();
    expect(ordersServiceSpy.registerOrders).toHaveBeenCalled();
    expect(ordersServiceSpy.registerOrderDetails).toHaveBeenCalled();
    expect(ordersServiceSpy.updateStock).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle error when registering order', () => {
    usersServiceSpy.checkLoginState.and.returnValue(true);
    usersServiceSpy.getLoggedInUserEmail.and.returnValue('test@example.com');
    localStorage.setItem('carts', JSON.stringify([{ idProduct: 1, product: 'test', price: 10, quantity: 1, total: 10, image: '' }]));
    ordersServiceSpy.registerOrders.and.returnValue(throwError(() => new Error('Error')));
    spyOn(window, 'alert');
    component.checkout();
    expect(ordersServiceSpy.registerOrders).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Hubo un problema al registrar la orden.');
  });

  it('should handle error when registering order detail', () => {
    usersServiceSpy.checkLoginState.and.returnValue(true);
    usersServiceSpy.getLoggedInUserEmail.and.returnValue('test@example.com');
    localStorage.setItem('carts', JSON.stringify([{ idProduct: 1, product: 'test', price: 10, quantity: 1, total: 10, image: '' }]));
    ordersServiceSpy.registerOrders.and.returnValue(of(mockOrder));
    ordersServiceSpy.registerOrderDetails.and.returnValue(throwError(() => new Error('Error')));
    spyOn(window, 'alert');
    component.checkout();
    expect(ordersServiceSpy.registerOrderDetails).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Hubo un problema al registrar un detalle de la orden.');
  });

  it('should handle error when updating stock', () => {
    usersServiceSpy.checkLoginState.and.returnValue(true);
    usersServiceSpy.getLoggedInUserEmail.and.returnValue('test@example.com');
    localStorage.setItem('carts', JSON.stringify([{ idProduct: 1, product: 'test', price: 10, quantity: 1, total: 10, image: '' }]));
    ordersServiceSpy.registerOrders.and.returnValue(of(mockOrder));
    ordersServiceSpy.registerOrderDetails.and.returnValue(of(true));
    ordersServiceSpy.updateStock.and.returnValue(throwError(() => new Error('Error'))); 
    spyOn(window, 'alert');
    component.checkout();
    expect(ordersServiceSpy.updateStock).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Hubo un problema al actualizar el stock del producto.');
  });

  it('should redirect to login if not logged in', () => {
    usersServiceSpy.checkLoginState.and.returnValue(false);
    component.checkout();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should attach click event listener to links in afterViewInit', () => {
    const link = document.createElement('a');
    link.setAttribute('href', '/test');
    document.body.appendChild(link);
    component.ngAfterViewInit();
    link.click();
    expect(navigationServiceSpy.navigateWithDelay).toHaveBeenCalledWith('/test');
  });
});