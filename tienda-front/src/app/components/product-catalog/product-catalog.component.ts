import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Params } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss'],
})
export class ProductCatalogComponent implements OnInit, AfterViewInit {
  filteredProducts: { [category: string]: any[] } = {}; // Tipo explícito
  filterText: string = '';
  allProducts: { [category: string]: any[] } = {};

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log('Cargando productos desde el backend...');

    // Manejo de parámetros de consulta (queryParams)
    this.route.queryParams.subscribe((params: Params) => {
      const filter = params['filter'];
      if (filter) {
        this.filterText = filter; // Asigna el filtro desde la URL
      }

      // Cargar productos desde el backend
      this.productsService.getProductsGroupedByCategory().subscribe({
        next: (products) => {
          console.log('Productos cargados:', products);
          this.allProducts = products;
          this.filterProducts(); // Aplica el filtro después de cargar los productos
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
        },
      });
    });
  }

  filterProducts(): void {
    this.filteredProducts = {}; // Reinicia los productos filtrados

    for (const category in this.allProducts) {
      if (this.allProducts.hasOwnProperty(category)) {
        // Si el filtro está vacío, muestra todos los productos
        if (this.filterText.trim() === '') {
          this.filteredProducts[category] = [...this.allProducts[category]];
        } else {
          // Aplica el filtro por título o categoría
          this.filteredProducts[category] = this.allProducts[category].filter((product: any) =>
            product.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
            category.toLowerCase().includes(this.filterText.toLowerCase())
          );
        }
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        link.addEventListener('click', (event: Event) => {
          event.preventDefault();
          const target = event.target as HTMLElement;
          const href = target.getAttribute('href');
          if (href) {
            this.navigationService.navigateWithDelay(href);
          }
        });
      });
    }
  }
}