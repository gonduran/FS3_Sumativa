import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { ProductsService } from '../../services/products.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product, Categoria } from '../../builder/product.builder';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let router: Router;

  const mockCategories: Categoria[] = [
    { id: 1, nombre: 'Category 1', descripcion: 'Description 1' }
  ];

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['getAllCategories', 'createProduct']);
    
    await TestBed.configureTestingModule({
      imports: [AddProductComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    mockProductsService.getAllCategories.and.returnValue(of(mockCategories));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate form fields', () => {
      expect(component.addProductForm.valid).toBeFalsy();
      
      component.addProductForm.controls['title'].setValue('');
      expect(component.addProductForm.controls['title'].errors?.['required']).toBeTruthy();
      
      component.addProductForm.controls['title'].setValue('ab');
      expect(component.addProductForm.controls['title'].errors?.['minlength']).toBeTruthy();

      component.addProductForm.controls['price'].setValue(0);
      expect(component.addProductForm.controls['price'].errors?.['min']).toBeTruthy();

      component.addProductForm.controls['description'].setValue('short');
      expect(component.addProductForm.controls['description'].errors?.['minlength']).toBeTruthy();

      component.addProductForm.controls['image'].setValue('invalid.txt');
      expect(component.addProductForm.controls['image'].errors?.['pattern']).toBeTruthy();
    });

    it('should validate image format', () => {
      const imageControl = component.addProductForm.get('image');
      imageControl?.setValue('test.jpg');
      expect(imageControl?.valid).toBeTruthy();

      imageControl?.setValue('test.png');
      expect(imageControl?.valid).toBeTruthy();
    });
  });

  describe('Category Loading', () => {
    it('should load categories on init', () => {
      expect(component.categories).toEqual(mockCategories);
    });

    it('should handle category loading error', () => {
      mockProductsService.getAllCategories.and.returnValue(throwError(() => new Error('Load error')));
      spyOn(window, 'alert');
      spyOn(console, 'error');

      component.loadCategories();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al cargar las categorías. Inténtelo nuevamente.');
    });
  });

  describe('Product Creation', () => {
    const validProduct = {
      title: 'Test Product',
      category: '1',
      price: 10,
      stock: 5,
      image: 'test.jpg',
      description: 'Test Description Long Enough'
    };

    it('should create product successfully', () => {
      spyOn(window, 'alert');
      spyOn(router, 'navigate');
      mockProductsService.createProduct.and.returnValue(of({} as Product));

      component.addProductForm.patchValue(validProduct);
      component.onSubmit();

      expect(mockProductsService.createProduct).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Producto agregado exitosamente.');
      expect(router.navigate).toHaveBeenCalledWith(['/list-product']);
    });

    it('should handle creation error', () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');
      mockProductsService.createProduct.and.returnValue(throwError(() => new Error('Create error')));

      component.addProductForm.patchValue(validProduct);
      component.onSubmit();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Ocurrió un error al agregar el producto. Inténtelo nuevamente.');
    });

    it('should handle invalid form submission', () => {
      spyOn(window, 'alert');
      component.onSubmit();
      expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos correctamente.');
    });

    it('should use default image if empty', () => {
      spyOn(window, 'alert');
      const productWithoutImage = { ...validProduct, image: '' };
      mockProductsService.createProduct.and.returnValue(of({} as Product));

      component.addProductForm.patchValue(productWithoutImage);
      component.onSubmit();

      const createProductCall = mockProductsService.createProduct.calls.first().args[0];
      expect(createProductCall.imagen).toBe('assets/images/no_imagen.jpg');
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