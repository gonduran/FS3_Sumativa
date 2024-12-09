import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCatalogComponent } from './product-catalog.component';
import { NavigationService } from '../../services/navigation.service';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductCatalogComponent', () => {
  let component: ProductCatalogComponent;
  let fixture: ComponentFixture<ProductCatalogComponent>;
  let navigationServiceSpy: jasmine.SpyObj<NavigationService>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  const mockProducts = {
    'Category 1': [
      { title: 'Product 1', description: '...', price: 10, image: '...', stock: 10 },
      { title: 'Product 2', description: '...', price: 20, image: '...', stock: 5 }
    ],
    'Category 2': [
      { title: 'Product 3', description: '...', price: 30, image: '...', stock: 8 }
    ]
  };

  beforeEach(async () => {
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    productsServiceSpy = jasmine.createSpyObj('ProductsService', ['getProductsGroupedByCategory']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);
    activatedRouteSpy.queryParams = of({ filter: 'Product 1' }); // Simula queryParams

    await TestBed.configureTestingModule({
      imports: [ProductCatalogComponent, RouterTestingModule],
      providers: [
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: 'PLATFORM_ID', useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCatalogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and apply filter on init', () => {
    productsServiceSpy.getProductsGroupedByCategory.and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(productsServiceSpy.getProductsGroupedByCategory).toHaveBeenCalled();
    expect(component.allProducts).toEqual(mockProducts);
    expect(component.filteredProducts['Category 1'].length).toBe(1); // Filtro aplicado
    expect(component.filteredProducts['Category 1'][0].title).toBe('Product 1');
  });

  it('should filter products correctly', () => {
    component.allProducts = mockProducts;
    component.filterText = 'Product 2';
    component.filterProducts();
    expect(component.filteredProducts['Category 1'].length).toBe(1);
    expect(component.filteredProducts['Category 1'][0].title).toBe('Product 2');

    component.filterText = 'Category 2';
    component.filterProducts();
    expect(component.filteredProducts['Category 2'].length).toBe(1);
    expect(component.filteredProducts['Category 2'][0].title).toBe('Product 3');

    component.filterText = '';
    component.filterProducts();
    expect(component.filteredProducts['Category 1'].length).toBe(2);
    expect(component.filteredProducts['Category 2'].length).toBe(1);
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