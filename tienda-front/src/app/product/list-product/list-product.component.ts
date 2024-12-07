import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product, ProductBuilder } from '../../builder/product.builder';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit, AfterViewInit {
  products: Product[] = [];

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private productsService: ProductsService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.validateAuthentication()) {
      this.router.navigate(['/login']);
    }
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
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
   * @description Carga los productos desde el servicio.
   */
  loadProducts(): void {
    console.log('Ejecutando loadProducts...');
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        console.log("Datos recibidos del backend:", data);
        this.products = data;
        console.log('Productos cargados:', this.products);
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }

  /**
   * @description Elimina un producto.
   * @param id - ID del producto a eliminar.
   */
  deleteProduct(id: string): void {
    console.log('Ejecutando deleteProduct...');
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(product => product.id !== id);
        alert('Producto eliminado exitosamente.');
      },
      error: (err) => console.error('Error al eliminar producto:', err),
    });
  }
}