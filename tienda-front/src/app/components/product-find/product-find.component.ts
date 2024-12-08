import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { OrdersService } from '../../services/orders.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-find',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-find.component.html',
  styleUrl: './product-find.component.scss'
})
export class ProductFindComponent implements OnInit, AfterViewInit {
  filterText: string = '';
  products: any[] = [];
  message: string = '';

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private ordersService: OrdersService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit ejecutado');
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

  searchProducts(): void {
    console.log('Iniciando búsqueda de productos...');
    console.log('Término de búsqueda ingresado:', this.filterText);

    this.message = ''; // Limpiar mensajes anteriores
    this.products = []; // Limpiar resultados anteriores

    if (!this.filterText.trim()) {
      console.warn('El campo de búsqueda está vacío.');
      this.message = 'Por favor, ingrese un término de búsqueda.';
      return;
    }

    this.productsService.findProducts(this.filterText).subscribe({
      next: (result) => {
        console.log('Respuesta del backend:', result);
        if (result.length === 0) {
          console.warn('No se encontraron productos.');
          this.message = 'No se encontraron productos.';
        } else {
          console.log('Productos encontrados:', result);
          this.products = result;
        }
      },
      error: (err) => {
        console.error('Error al buscar productos:', err);
        this.message = 'Ocurrió un error al realizar la búsqueda.';
      }
    });
  }
}