import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { CustomersService } from '../../services/customers.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.scss'
})
export class ProductCatalogComponent implements OnInit, AfterViewInit {
  filteredProducts: any = {};
  filterText: string = '';
  allProducts: any = {
    'Papelería': [
        // Papelería
        { title: 'Agenda 2025', price: 6490, category: 'Papelería', image: 'assets/images/agenda2025.webp', detailLink: '/product-detail' },
        { title: 'Cuaderno 120 Hojas', price: 5990, category: 'Papelería', image: 'assets/images/cuaderno1.webp', detailLink: '/product-detail' },
        { title: 'Cuaderno 150 hojas', price: 6990, category: 'Papelería', image: 'assets/images/cuaderno2.webp', detailLink: '/product-detail' },
        { title: 'Block Sketching', price: 6990, category: 'Papelería', image: 'assets/images/blocksketching.webp', detailLink: '/product-detail' },
    ],
    'Oficina': [
        // Oficina
        { title: 'Pizarra', price: 34990, category: 'Oficina', image: 'assets/images/pizarra.webp', detailLink: '/product-detail' },
        { title: 'Archivador', price: 4990, category: 'Oficina', image: 'assets/images/archivador.webp', detailLink: '/product-detail' },
        { title: 'Marcadores', price: 2990, category: 'Oficina', image: 'assets/images/marcadores.webp', detailLink: '/product-detail' },
        { title: 'Resma Carta', price: 5990, category: 'Oficina', image: 'assets/images/resma.webp', detailLink: '/product-detail' },
    ],
    'Impresión': [
        // Impresión
        { title: 'Tinta HP', price: 48990, category: 'Impresión', image: 'assets/images/tintahp.webp', detailLink: '/product-detail' },
        { title: 'Toner Samsung', price: 43690, category: 'Impresión', image: 'assets/images/toner1.webp', detailLink: '/product-detail' },
        { title: 'Toner Brother', price: 70990, category: 'Impresión', image: 'assets/images/toner2.webp', detailLink: '/product-detail' },
        { title: 'Papel Fotográfico', price: 5990, category: 'Impresión', image: 'assets/images/papelfoto.webp', detailLink: '/product-detail' },
    ],
  };

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private customersService: CustomersService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filter = params['filter'];
      this.filterText = filter || ''; // Asigna el filtro o un string vacío
      this.filterProducts(); // Aplica el filtro al cargar el componente
    });
  }

  filterProducts(): void {
    this.filteredProducts = {};
  
    for (const category in this.allProducts) {
      if (this.allProducts.hasOwnProperty(category)) {
        // Si el filtro está vacío o es solo espacios, muestra todos los productos
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
}