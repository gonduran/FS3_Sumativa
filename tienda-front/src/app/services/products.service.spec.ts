import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product, ProductByCategory, Categoria } from '../builder/product.builder';
import { environment } from '../../environments/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: 1,
    nombre: 'Test Product',
    descripcion: 'Test Description',
    precio: 100,
    imagen: 'test.jpg',
    stock: 10,
    categorias: [{ id: 1, nombre: 'Test Category', descripcion: 'Test Category Description' }]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('should get all products successfully', () => {
      const mockResponse = {
        _embedded: {
          productoList: [mockProduct]
        }
      };

      service.getAllProducts().subscribe(products => {
        expect(products.length).toBe(1);
        expect(products[0].id).toBe(mockProduct.id);
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle invalid response structure', () => {
      const mockInvalidResponse = {};

      service.getAllProducts().subscribe(products => {
        expect(products).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos`);
      req.flush(mockInvalidResponse);
    });

    it('should handle error response', () => {
      service.getAllProducts().subscribe(products => {
        expect(products).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getProductById', () => {
    it('should get product by id', () => {
      service.getProductById(1).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should handle error', () => {
      service.getProductById(1).subscribe({
        error: error => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos/1`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('createProduct', () => {
    it('should create product successfully', () => {
      service.createProduct(mockProduct).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockProduct);
    });

    it('should handle error', () => {
      service.createProduct(mockProduct).subscribe({
        error: error => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', () => {
      service.updateProduct(1, mockProduct).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProduct);
      req.flush(mockProduct);
    });

    it('should handle error', () => {
      service.updateProduct(1, mockProduct).subscribe({
        error: error => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos/1`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', () => {
      service.deleteProduct(1).subscribe(response => {
        expect(response).toBeNull();  // Cambiado de toBeUndefined() a toBeNull()
      });
  
      const req = httpMock.expectOne(`${environment.apiProductos}/productos/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  
    it('should handle error', () => {
      service.deleteProduct(1).subscribe({
        error: error => {
          expect(error).toBeTruthy();
        }
      });
  
      const req = httpMock.expectOne(`${environment.apiProductos}/productos/1`);
      const mockErrorResponse = {
        status: 404,
        statusText: 'Not Found'
      };
      req.flush('Error deleting product', mockErrorResponse);
    });
  });

  describe('getAllCategories', () => {
    const mockCategories: Categoria[] = [{
      id: 1,
      nombre: 'Test Category',
      descripcion: 'Test Description'
    }];

    it('should get all categories successfully', () => {
      const mockResponse = {
        _embedded: {
          categoriaList: mockCategories
        }
      };

      service.getAllCategories().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/categorias`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error', () => {
      service.getAllCategories().subscribe({
        error: error => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/categorias`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getProductsByCategory', () => {
    const mockProductsByCategory: ProductByCategory[] = [{
      idCategoria: 1,
      nombreCategoria: 'Test Category',
      descripcionCategoria: 'Test Description',
      idProducto: 1,
      nombreProducto: 'Test Product',
      imagenProducto: 'test.jpg'
    }];

    it('should get products by category successfully', () => {
      service.getProductsByCategory().subscribe(products => {
        expect(products).toEqual(mockProductsByCategory);
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos/product-by-category`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProductsByCategory);
    });

    it('should handle error', () => {
      service.getProductsByCategory().subscribe({
        error: error => {
          expect(error.message).toBe('Error al cargar productos por categoría');
        }
      });

      const req = httpMock.expectOne(`${environment.apiProductos}/productos/product-by-category`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getProductsGroupedByCategory', () => {
    it('should get grouped products successfully', () => {
      const mockGroupedProducts = { category1: [mockProduct] };

      service.getProductsGroupedByCategory().subscribe(products => {
        expect(products).toEqual(mockGroupedProducts);
      });

      const req = httpMock.expectOne(`${environment.apiPedidos}/productos/productos-agrupados-categoria`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGroupedProducts);
    });
  });

  describe('findProducts', () => {
    it('should find products successfully', () => {
      const mockFoundProducts = [mockProduct];
      const searchTerm = 'test';

      service.findProducts(searchTerm).subscribe(products => {
        expect(products).toEqual(mockFoundProducts);
      });

      const req = httpMock.expectOne(`${environment.apiPedidos}/productos/buscar?filtro=${searchTerm}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFoundProducts);
    });
  });
});