// home.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { ProductsService } from '../../services/products.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { PLATFORM_ID, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductByCategory } from '../../builder/product.builder';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    // Crear mocks para los servicios
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['/* métodos necesarios */']);
    mockProductsService = jasmine.createSpyObj('ProductsService', ['getProductsByCategory']);

    // Configurar el mock para que getProductsByCategory retorne un observable vacío por defecto
    mockProductsService.getProductsByCategory.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent, // Importa el componente standalone directamente
        RouterTestingModule // Importa RouterTestingModule para funcionalidades de enrutamiento
      ],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: PLATFORM_ID, useValue: 'browser' } // Puedes ajustar esto en pruebas específicas
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignora errores de elementos desconocidos en la plantilla
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta la detección de cambios para inicializar el componente
  });

  it('debería crear el HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería llamar a loadProductsByCategory al inicializar', () => {
      spyOn(component, 'loadProductsByCategory');
      component.ngOnInit();
      expect(component.loadProductsByCategory).toHaveBeenCalled();
    });
  });

  describe('loadProductsByCategory', () => {
    it('debería cargar productos por categoría exitosamente', () => {
      const mockData: ProductByCategory[] = [
        {
          idCategoria: 1,
          nombreCategoria: 'Electrónica',
          descripcionCategoria: 'Productos electrónicos',
          idProducto: 101,
          nombreProducto: 'Televisor',
          imagenProducto: 'tv.png'
        },
        {
          idCategoria: 2,
          nombreCategoria: 'Libros',
          descripcionCategoria: 'Variedad de libros',
          idProducto: 102,
          nombreProducto: 'Novela',
          imagenProducto: 'novela.png'
        }
      ];
      mockProductsService.getProductsByCategory.and.returnValue(of(mockData));

      component.loadProductsByCategory();
      expect(mockProductsService.getProductsByCategory).toHaveBeenCalled();
      expect(component.productsByCategory).toEqual(mockData);
      // Opcional: Verificar que se haya registrado en la consola
    });

    it('debería manejar errores al cargar productos por categoría', () => {
      const mockError = new Error('Error al cargar productos');
      mockProductsService.getProductsByCategory.and.returnValue(throwError(() => mockError));

      spyOn(console, 'error');

      component.loadProductsByCategory();
      expect(mockProductsService.getProductsByCategory).toHaveBeenCalled();
      expect(component.productsByCategory).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error al cargar los productos por categoría:', mockError);
    });
  });

  describe('ngAfterViewInit', () => {
    it('debería añadir event listeners a todos los enlaces cuando el platform es browser', () => {
      // Preparar el DOM con enlaces
      const link1 = document.createElement('a');
      link1.href = '/test-route-1';
      link1.textContent = 'Test Route 1';
      document.body.appendChild(link1);

      const link2 = document.createElement('a');
      link2.href = '/test-route-2';
      link2.textContent = 'Test Route 2';
      document.body.appendChild(link2);

      // Ejecutar ngAfterViewInit para añadir los event listeners
      component.ngAfterViewInit();

      // Simular clic en el primer enlace
      link1.click();
      expect(mockNavigationService.navigateWithDelay).toHaveBeenCalledWith('/test-route-1');

      // Simular clic en el segundo enlace
      link2.click();
      expect(mockNavigationService.navigateWithDelay).toHaveBeenCalledWith('/test-route-2');

      // Limpiar el DOM
      document.body.removeChild(link1);
      document.body.removeChild(link2);
    });

    /*it('no debería añadir event listeners a los enlaces cuando el platform no es browser', () => {
      // Reconfigurar TestBed con PLATFORM_ID como 'server'
      TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
      TestBed.compileComponents();

      // Recrear el fixture y el componente
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Preparar el DOM con un enlace
      const link = document.createElement('a');
      link.href = '/test-route';
      link.textContent = 'Test Route';
      document.body.appendChild(link);

      // Ejecutar ngAfterViewInit
      component.ngAfterViewInit();

      // Simular clic en el enlace
      link.click();
      expect(mockNavigationService.navigateWithDelay).not.toHaveBeenCalled();

      // Limpiar el DOM
      document.body.removeChild(link);
    });*/
  });

  describe('Casos de Borde', () => {
    it('debería manejar categorías de productos vacías', () => {
      mockProductsService.getProductsByCategory.and.returnValue(of([]));

      component.loadProductsByCategory();
      expect(mockProductsService.getProductsByCategory).toHaveBeenCalled();
      expect(component.productsByCategory).toEqual([]);
    });

    it('debería manejar productos sin categorías definidas', () => {
      const mockData: ProductByCategory[] = [
        {
          idCategoria: 3,
          nombreCategoria: '',
          descripcionCategoria: '',
          idProducto: 103,
          nombreProducto: 'Producto Sin Categoría',
          imagenProducto: 'producto_sin_categoria.png'
        }
      ];
      mockProductsService.getProductsByCategory.and.returnValue(of(mockData));

      component.loadProductsByCategory();
      expect(mockProductsService.getProductsByCategory).toHaveBeenCalled();
      expect(component.productsByCategory).toEqual(mockData);
    });
  });
});