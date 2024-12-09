import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditProductComponent } from './edit-product.component';
import { ProductsService } from '../../services/products.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product, Categoria } from '../../builder/product.builder';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let router: Router;

  const mockProduct: Product = {
    id: 1,
    nombre: 'Test Product',
    descripcion: 'Test Description',
    precio: 100,
    imagen: 'test.jpg',
    stock: 10,
    categorias: [{ id: 1, nombre: 'Category 1', descripcion: 'Description 1' }]
  };

  const mockCategories: Categoria[] = [
    { id: 1, nombre: 'Category 1', descripcion: 'Description 1' }
  ];

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['getProductById', 'getAllCategories', 'updateProduct']);

    await TestBed.configureTestingModule({
      imports: [EditProductComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;

    mockProductsService.getProductById.and.returnValue(of(mockProduct));
    mockProductsService.getAllCategories.and.returnValue(of(mockCategories));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load product and categories', () => {
      fixture.detectChanges();
      
      expect(component.editProductForm.get('title')?.value).toBe(mockProduct.nombre);
      expect(component.editProductForm.get('price')?.value).toBe(mockProduct.precio);
      expect(component.categories).toEqual(mockCategories);
    });

    it('should handle invalid product id', fakeAsync(() => {
      const mockRouter = { navigate: jasmine.createSpy('navigate') };
      TestBed.resetTestingModule();
      
      TestBed.configureTestingModule({
        imports: [EditProductComponent, ReactiveFormsModule, RouterTestingModule],
        providers: [
          { provide: ProductsService, useValue: mockProductsService },
          { provide: Router, useValue: mockRouter },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: { 
                paramMap: { 
                  get: () => null 
                } 
              }
            }
          }
        ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(EditProductComponent);
      component = fixture.componentInstance;
      
      // Ejecutar ngOnInit explícitamente
      component.ngOnInit();
      tick();
      fixture.detectChanges();
  
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/list-product']);
    }));

    it('should handle product loading error', () => {
      mockProductsService.getProductById.and.returnValue(throwError(() => new Error('Load error')));
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      spyOn(console, 'error');

      fixture.detectChanges();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('No se pudo cargar el producto. Inténtelo nuevamente.');
      expect(router.navigate).toHaveBeenCalledWith(['/list-product']);
    });

    it('should handle categories loading error', () => {
      mockProductsService.getAllCategories.and.returnValue(throwError(() => new Error('Load error')));
      spyOn(window, 'alert');
      spyOn(console, 'error');

      fixture.detectChanges();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al cargar las categorías. Inténtelo nuevamente.');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate required fields', () => {
      component.editProductForm.controls['title'].setValue('');
      expect(component.editProductForm.controls['title'].errors?.['required']).toBeTruthy();

      component.editProductForm.controls['description'].setValue('');
      expect(component.editProductForm.controls['description'].errors?.['required']).toBeTruthy();
    });

    it('should validate field lengths', () => {
      component.editProductForm.controls['title'].setValue('ab');
      expect(component.editProductForm.controls['title'].errors?.['minlength']).toBeTruthy();

      component.editProductForm.controls['description'].setValue('short');
      expect(component.editProductForm.controls['description'].errors?.['minlength']).toBeTruthy();
    });
  });

  describe('Product Update', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update product successfully', () => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      mockProductsService.updateProduct.and.returnValue(of(mockProduct));

      component.onSubmit();

      expect(mockProductsService.updateProduct).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Producto actualizado correctamente.');
      expect(router.navigate).toHaveBeenCalledWith(['/list-product']);
    });

    it('should handle update error', () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');
      mockProductsService.updateProduct.and.returnValue(throwError(() => new Error('Update error')));

      component.onSubmit();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al actualizar el producto. Inténtelo nuevamente.');
    });

    it('should handle invalid form submission', () => {
      spyOn(window, 'alert');
      component.editProductForm.controls['title'].setValue('');
      component.onSubmit();
      expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos correctamente.');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to product list', () => {
      spyOn(router, 'navigate');
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/list-product']);
    });
  });
});