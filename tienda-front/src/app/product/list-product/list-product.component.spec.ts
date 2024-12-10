import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProductComponent } from './list-product.component';
import { ProductsService } from '../../services/products.service';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('ListProductComponent', () => {
  let component: ListProductComponent;
  let fixture: ComponentFixture<ListProductComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockProducts = [
    {
      id: 1,
      nombre: 'Test Product',
      precio: 100,
      stock: 10,
      imagen: 'test.jpg',
      descripcion: 'Test Description',
      categorias: [{ id: 1, nombre: 'Category 1', descripcion: 'Description 1' }]
    }
  ];

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['getAllProducts', 'deleteProduct']);
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['validateAuthentication']);

    await TestBed.configureTestingModule({
      imports: [ListProductComponent, FormsModule, RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockAuthService.validateAuthentication.and.returnValue(true);
    mockProductsService.getAllProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  /*describe('Authentication', () => {
    it('should redirect to login if not authenticated', () => {
      mockAuthService.validateAuthentication.and.returnValue(false);
      spyOn(router, 'navigate');
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });*/

  describe('Product Loading', () => {
    beforeEach(() => {
      mockAuthService.validateAuthentication.and.returnValue(true);
    });

    it('should load products successfully', () => {
      mockProductsService.getAllProducts.and.returnValue(of(mockProducts));
      component.loadProducts();
      expect(component.products.length).toBe(1);
      expect(component.products[0].id).toBe(1);
    });

    it('should handle error when loading products', () => {
      spyOn(console, 'error');
      mockProductsService.getAllProducts.and.returnValue(throwError(() => new Error('Load error')));
      component.loadProducts();
      expect(console.error).toHaveBeenCalledWith('Error al cargar productos:', jasmine.any(Error));
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      component.products = mockProducts;
      component.filteredProducts = [...mockProducts];
    });

    it('should filter products by category', () => {
      component.filterCategory = 'Category';
      component.applyFilter();
      expect(component.filteredProducts.length).toBe(1);

      component.filterCategory = 'NonExistent';
      component.applyFilter();
      expect(component.filteredProducts.length).toBe(0);
    });

    it('should reset filter', () => {
      component.filterCategory = '';
      component.applyFilter();
      expect(component.filteredProducts.length).toBe(component.products.length);
    });
  });

  describe('Pagination', () => {
    it('should calculate total pages correctly', () => {
      component.filteredProducts = Array(10).fill(mockProducts[0]);
      component.itemsPerPage = 5;
      component.updatePagination();
      expect(component.totalPages).toBe(2);
    });

    it('should navigate between pages', () => {
      component.totalPages = 3;
      component.goToPage(2);
      expect(component.currentPage).toBe(2);

      component.goToPage(0);
      expect(component.currentPage).not.toBe(0);

      component.goToPage(4);
      expect(component.currentPage).not.toBe(4);
    });
  });

  describe('Product Deletion', () => {
    it('should delete product successfully', () => {
      spyOn(window, 'alert');
      mockProductsService.deleteProduct.and.returnValue(of(void 0));
      component.products = [...mockProducts];
      component.filteredProducts = [...mockProducts];

      component.deleteProduct(1);

      expect(component.products.length).toBe(0);
      expect(window.alert).toHaveBeenCalledWith('Producto eliminado exitosamente.');
    });

    it('should handle deletion error', () => {
      spyOn(console, 'error');
      mockProductsService.deleteProduct.and.returnValue(throwError(() => new Error('Delete error')));

      component.deleteProduct(1);

      expect(console.error).toHaveBeenCalledWith('Error al eliminar producto:', jasmine.any(Error));
    });
  });

  describe('Link Navigation', () => {
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
  });
});