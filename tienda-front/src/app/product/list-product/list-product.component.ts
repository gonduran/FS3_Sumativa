import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../builder/product.builder';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  filterCategory: string = '';

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private productsService: ProductsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.validateAuthentication()) {
      this.router.navigate(['/login']);
    }
    this.loadProducts();
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

  /**
   * Carga los productos desde el servicio.
   */
  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        this.updatePagination();
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }

  /**
   * Filtra los productos por categoría (texto).
   */
  applyFilter(): void {
    this.filteredProducts = this.filterCategory
      ? this.products.filter((product) =>
          product.categorias[0]?.nombre.toLowerCase().includes(this.filterCategory.toLowerCase())
        )
      : [...this.products];
    this.currentPage = 1; // Resetear a la primera página
    this.updatePagination();
  }

  /**
   * Calcula la paginación y actualiza la lista de productos visible.
   */
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  /**
   * Cambia a la página especificada.
   * @param page Número de la página a mostrar.
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Elimina un producto.
   * @param id - ID del producto a eliminar.
   */
  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.id !== id);
        this.applyFilter(); // Actualizar la lista filtrada después de eliminar
        alert('Producto eliminado exitosamente.');
      },
      error: (err) => console.error('Error al eliminar producto:', err),
    });
  }
}