import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { OrdersService } from '../../services/orders.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service'; 

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  origin: string = 'product-catalog';
  addToCartForm: FormGroup;
  quantity: number = 1;
  minQuantity: number = 1;
  maxQuantity: number = 10;
  selectedProduct: any;
  idProducto: number = 0;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private ordersService: OrdersService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {
    console.log('Constructor ejecutado');
    this.addToCartForm = this.fb.group({
      quantity: [this.quantity, [Validators.required, Validators.min(this.minQuantity), Validators.max(this.maxQuantity)]]
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    // Captura el parámetro "from" de la URL
    this.route.queryParams.subscribe(params => {
      this.origin = params['from'] || 'product-catalog';
      console.log('Página de origen:', this.origin);
    });
    // Obtener el ID del producto desde los parámetros de la URL
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID del producto obtenido de la URL:', id);
    
    if (id) {
      const productId = Number(id);
      this.idProducto = productId;
      if (!isNaN(productId)) {
        console.log('Solicitando producto al backend con ID:', productId);
        this.productsService.getProductById(productId).subscribe({
          next: (product) => {
            this.selectedProduct = product;
            console.log('Producto cargado:', this.selectedProduct);
          },
          error: (err) => {
            console.error('Error al cargar el producto:', err);
            this.router.navigate(['/product-catalog']); // Redirige si no se encuentra el producto
          }
        });
      } else {
        console.error('ID de producto inválido.');
        this.router.navigate(['/product-catalog']);
      }
    } else {
      console.error('No se encontró el parámetro "id".');
      this.router.navigate(['/product-catalog']);
    }
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

  goBack(): void {
    console.log('Volviendo al catálogo');
    // Navega a la página de origen
    this.router.navigate([`/${this.origin}`]);
  }

  addToCart(): void {
    if (this.addToCartForm.valid && this.selectedProduct) {
      const quantity = this.addToCartForm.value.quantity;
      const total = quantity * this.selectedProduct.precio;
      console.log('Producto agregado al carro:', {
        product: this.idProducto,
        quantity,
        total
      });
      // Lógica adicional para agregar al carrito
      const registroExitoso = this.ordersService.registerCarts(this.idProducto, this.selectedProduct.imagen, this.selectedProduct.precio, quantity, total);
      if (registroExitoso) {
        console.log('Registro exitoso.');
      } else {
        console.log('Error en el registro.');
      }
    }
  }
}