import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../builder/product.builder';
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
    this.products = this.productsService.getProducts();
  }

  /**
   * @description Elimina un producto.
   * @param id - ID del producto a eliminar.
   */
  deleteProduct(id: string): void {
    const confirmDelete = confirm('¿Está seguro de que desea eliminar este producto?');
    if (confirmDelete) {
      this.productsService.deleteProduct(id);
      this.loadProducts();
      alert('Producto eliminado exitosamente.');
    }
  }
}