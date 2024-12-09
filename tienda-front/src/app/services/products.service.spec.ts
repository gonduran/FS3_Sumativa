import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from '../../environments/environment';
import { ProductBuilder, Product } from '../builder/product.builder';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
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

  /*it('should get all products', () => {
    const mockResponse = {
      _embedded: {
        productoList: [
          {
            id: 1,
            nombre: 'Producto 1',
            descripcion: 'Descripción 1',
            precio: 100,
            categorias: ['Categoría 1'],
            imagen: 'imagen1.jpg',
            stock: 10,
          },
        ],
      },
    };

    service.getAllProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].id).toBe(1);
      expect(products[0].nombre).toBe('Producto 1');
    });

    const req = httpMock.expectOne(`${environment.apiProductos}/productos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle empty product response structure', () => {
    const mockResponse = {};

    service.getAllProducts().subscribe((products) => {
      expect(products.length).toBe(0);
    });

    const req = httpMock.expectOne(`${environment.apiProductos}/productos`);
    req.flush(mockResponse);
  });

  it('should get product by ID', () => {
    const mockProduct = {
      id: 1,
      nombre: 'Producto 1',
      descripcion: 'Descripción 1',
      precio: 100,
      categorias: ['Categoría 1'],
      imagen: 'imagen1.jpg',
      stock: 10,
    };

    service.getProductById(1).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product.nombre).toBe('Producto 1');
    });

    const req = httpMock.expectOne(`${environment.apiProductos}/productos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a product', () => {
    const mockProduct = new ProductBuilder()
      .setId(1)
      .setTitle('Producto 1')
      .setDescription('Descripción 1')
      .setPrice(100)
      .setStock(10)
      .build();

    service.createProduct(mockProduct).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product.nombre).toBe('Producto 1');
    });

    const req = httpMock.expectOne(`${environment.apiProductos}/productos`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should update a product', () => {
    const mockProduct = new ProductBuilder()
      .setId(1)
      .setTitle('Producto 1 Actualizado')
      .setDescription('Descripción Actualizada')
      .setPrice(150)
      .setStock(20)
      .build();

    service.updateProduct(1, mockProduct).subscribe((product) => {
      expect(product.nombre).toBe('Producto 1 Actualizado');
    });

    const req = httpMock.expectOne(`${environment.apiProductos}/productos/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct(1).subscribe((response) => {
      expect(response === null || response === undefined).toBeTrue();
    });
  
    const req = httpMock.expectOne(`${environment.apiProductos}/productos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // Simula que el backend devuelve null
  });

  it('should get all categories', () => {
    const mockResponse = {
      _embedded: {
        categoriaList: [
          { id: 1, nombre: 'Categoría 1', descripcion: 'Descripción 1' },
        ],
      },
    };

    service.getAllCategories().subscribe((categories) => {
      expect(categories.length).toBe(1);
      expect(categories[0].nombre).toBe('Categoría 1');
    });

    const req = httpMock.expectOne(`${environment.apiProductos}/categorias`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get products by category', () => {
    const mockResponse = [
      { category: 'Categoría 1', products: [{ id: 1, name: 'Producto 1' }] },
    ];

    service.getProductsByCategory().subscribe((response) => {
      expect(response.length).toBe(1);
      expect(response[0].nombreCategoria).toBe('Categoría 1');
    });

    const req = httpMock.expectOne(
      `${environment.apiProductos}/productos/product-by-category`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should find products by filter', () => {
    const mockResponse = [{ id: 1, name: 'Producto 1' }];

    service.findProducts('Producto').subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Producto 1');
    });

    const req = httpMock.expectOne(
      `${environment.apiPedidos}/productos/buscar?filtro=Producto`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get products grouped by category', () => {
    const mockResponse = [
      { category: 'Categoría 1', products: [{ id: 1, name: 'Producto 1' }] },
    ];

    service.getProductsGroupedByCategory().subscribe((response) => {
      expect(response.length).toBe(1);
      expect(response[0].category).toBe('Categoría 1');
    });

    const req = httpMock.expectOne(
      `${environment.apiPedidos}/productos/productos-agrupados-categoria`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });*/
});