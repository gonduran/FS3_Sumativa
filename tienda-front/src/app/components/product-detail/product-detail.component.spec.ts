import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { NavigationService } from '../../services/navigation.service';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../services/products.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockOrdersService: jasmine.SpyObj<OrdersService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let router: Router;

  const mockProduct = {
    id: 1,
    nombre: 'Test Product',
    descripcion: 'Test Description',
    precio: 100,
    imagen: 'test.jpg',
    stock: 10,
    categorias: [{ id: 1, nombre: 'Category 1', descripcion: 'Description 1' }]
  };

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['getProductById']);
    mockOrdersService = jasmine.createSpyObj('OrdersService', ['registerCarts']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: OrdersService, useValue: mockOrdersService },
        { provide: NavigationService, useValue: mockNavigationService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            },
            queryParams: of({ from: 'product-catalog' })
          }
        },
        { provide: 'PLATFORM_ID', useValue: 'browser' }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockProductsService.getProductById.and.returnValue(of(mockProduct));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load product details', () => {
      mockProductsService.getProductById.and.returnValue(of(mockProduct));
      fixture.detectChanges();
      expect(component.selectedProduct).toEqual(mockProduct);
    });

    it('should handle invalid product id', fakeAsync(() => {
      const mockRouter = { navigate: jasmine.createSpy('navigate') };
      TestBed.resetTestingModule();
      
      TestBed.configureTestingModule({
        declarations: [],
        imports: [ProductDetailComponent, ReactiveFormsModule, RouterTestingModule],
        providers: [
          { provide: ProductsService, useValue: mockProductsService },
          { provide: OrdersService, useValue: mockOrdersService },
          { provide: NavigationService, useValue: mockNavigationService },
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { 
                paramMap: { 
                  get: jasmine.createSpy('get').and.returnValue('abc') 
                } 
              },
              queryParams: of({})
            }
          },
          { provide: 'PLATFORM_ID', useValue: 'browser' }
        ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(ProductDetailComponent);
      component = fixture.componentInstance;
      
      // Necesitamos detectar los cambios antes de hacer el tick
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
  
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/product-catalog']);
    }));  

    it('should handle missing product id', fakeAsync(() => {
      const mockRouter = { navigate: jasmine.createSpy('navigate') };
      TestBed.resetTestingModule();
      
      TestBed.configureTestingModule({
        declarations: [],
        imports: [ProductDetailComponent, ReactiveFormsModule, RouterTestingModule],
        providers: [
          { provide: ProductsService, useValue: mockProductsService },
          { provide: OrdersService, useValue: mockOrdersService },
          { provide: NavigationService, useValue: mockNavigationService },
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { 
                paramMap: { 
                  get: jasmine.createSpy('get').and.returnValue(null) 
                } 
              },
              queryParams: of({})
            }
          },
          { provide: 'PLATFORM_ID', useValue: 'browser' }
        ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(ProductDetailComponent);
      component = fixture.componentInstance;
      
      // Detectar cambios antes y después del tick
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
  
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/product-catalog']);
    }));  

    it('should handle product loading error', () => {
      spyOn(router, 'navigate');
      mockProductsService.getProductById.and.returnValue(throwError(() => new Error('Load error')));
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/product-catalog']);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      mockProductsService.getProductById.and.returnValue(of(mockProduct));
      fixture.detectChanges();
    });

    it('should validate quantity limits', () => {
      const quantityControl = component.addToCartForm.get('quantity');
      quantityControl?.setValue(0);
      expect(quantityControl?.errors?.['min']).toBeTruthy();

      quantityControl?.setValue(11);
      expect(quantityControl?.errors?.['max']).toBeTruthy();

      quantityControl?.setValue(5);
      expect(quantityControl?.valid).toBeTruthy();
    });
  });

  describe('Cart Operations', () => {
    beforeEach(() => {
      mockProductsService.getProductById.and.returnValue(of(mockProduct));
      fixture.detectChanges();
    });

    it('should add product to cart successfully', () => {
      mockOrdersService.registerCarts.and.returnValue(true);
      spyOn(console, 'log');

      component.addToCartForm.get('quantity')?.setValue(2);
      component.addToCart();

      expect(mockOrdersService.registerCarts).toHaveBeenCalledWith(
        component.idProducto,
        mockProduct.nombre,
        mockProduct.imagen,
        mockProduct.precio,
        2,
        200
      );
      expect(console.log).toHaveBeenCalledWith('Registro exitoso.');
    });

    it('should handle cart registration failure', () => {
      mockOrdersService.registerCarts.and.returnValue(false);
      spyOn(console, 'log');

      component.addToCartForm.get('quantity')?.setValue(2);
      component.addToCart();

      expect(console.log).toHaveBeenCalledWith('Error en el registro.');
    });

    it('should not add to cart with invalid form', () => {
      component.addToCartForm.get('quantity')?.setValue(0);
      component.addToCart();
      expect(mockOrdersService.registerCarts).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should handle link clicks', () => {
      const mockLink = document.createElement('a');
      mockLink.href = '/test-route';
      document.body.appendChild(mockLink);

      component.ngAfterViewInit();
      mockLink.click();

      expect(mockNavigationService.navigateWithDelay).toHaveBeenCalledWith('/test-route');
      document.body.removeChild(mockLink);
    });

    it('should not navigate if href is null', () => {
      const mockLink = document.createElement('a');
      document.body.appendChild(mockLink);

      component.ngAfterViewInit();
      mockLink.click();

      expect(mockNavigationService.navigateWithDelay).not.toHaveBeenCalled();
      document.body.removeChild(mockLink);
    });

    it('should navigate back to origin', () => {
      spyOn(router, 'navigate');
      component.origin = 'test-origin';
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/test-origin']);
    });
  });
});