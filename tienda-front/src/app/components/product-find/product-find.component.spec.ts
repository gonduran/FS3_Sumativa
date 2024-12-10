import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFindComponent } from './product-find.component';
import { NavigationService } from '../../services/navigation.service';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductFindComponent', () => {
  let component: ProductFindComponent;
  let fixture: ComponentFixture<ProductFindComponent>;
  let navigationServiceSpy: jasmine.SpyObj<NavigationService>;
  let ordersServiceSpy: jasmine.SpyObj<OrdersService>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>; // Agrega spy para ActivatedRoute

  const mockProducts = [
    { title: 'Product 1', description: '...', price: 10, image: '...', stock: 10 },
    { title: 'Product 2', description: '...', price: 20, image: '...', stock: 5 }
  ];

  beforeEach(async () => {
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    ordersServiceSpy = jasmine.createSpyObj('OrdersService', ['']);
    productsServiceSpy = jasmine.createSpyObj('ProductsService', ['findProducts']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']); // Inicializa el spy de ActivatedRoute

    await TestBed.configureTestingModule({
      imports: [ProductFindComponent, ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: OrdersService, useValue: ordersServiceSpy },
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }, // Provee el spy de ActivatedRoute
        { provide: 'PLATFORM_ID', useValue: 'browser' },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFindComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for products', () => {
    component.filterText = 'Product';
    productsServiceSpy.findProducts.and.returnValue(of(mockProducts));
    component.searchProducts();
    expect(productsServiceSpy.findProducts).toHaveBeenCalledWith('Product');
    expect(component.products).toEqual(mockProducts);
    expect(component.message).toBe('');
  });

  it('should display message if no products found', () => {
    component.filterText = 'Nonexistent';
    productsServiceSpy.findProducts.and.returnValue(of([]));
    component.searchProducts();
    expect(component.message).toBe('No se encontraron productos.');
  });

  it('should display message if search term is empty', () => {
    component.filterText = '';
    component.searchProducts();
    expect(component.message).toBe('Por favor, ingrese un término de búsqueda.');
  });

  it('should handle error when searching for products', () => {
    component.filterText = 'Product';
    productsServiceSpy.findProducts.and.returnValue(throwError(() => new Error('Error')));
    component.searchProducts();
    expect(component.message).toBe('Ocurrió un error al realizar la búsqueda.');
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