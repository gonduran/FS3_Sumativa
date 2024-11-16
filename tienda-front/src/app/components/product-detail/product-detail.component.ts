import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { OrdersService } from '../../services/orders.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service'; // Servicio para obtener datos del producto

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  addToCartForm: FormGroup;
  quantity: number = 1;
  minQuantity: number = 1;
  maxQuantity: number = 10;
  selectedProduct: any;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private ordersService: OrdersService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService // Servicio para obtener datos del producto
  ) {
    this.addToCartForm = this.fb.group({
      quantity: [this.quantity, [Validators.required, Validators.min(this.minQuantity), Validators.max(this.maxQuantity)]]
    });
  }

  ngOnInit(): void {
    // Obtener el título del producto desde los parámetros de la URL
    const title = this.route.snapshot.paramMap.get('title');
    if (title) {
      this.selectedProduct = this.productService.getProductByTitle(title);
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

  goBack(): void {
    this.router.navigate(['/product-catalog']);
  }

  addToCart(): void {
    if (this.addToCartForm.valid && this.selectedProduct) {
      const quantity = this.addToCartForm.value.quantity;
      const total = quantity * this.selectedProduct.price;
      console.log('Producto agregado al carro:', {
        product: this.selectedProduct.title,
        quantity,
        total
      });
      // Lógica adicional para agregar al carrito
      const registroExitoso = this.ordersService.registerCarts(this.selectedProduct.title, this.selectedProduct.image, this.selectedProduct.price, quantity, total);
      if (registroExitoso) {
        console.log('Registro exitoso.');
      } else {
        console.log('Error en el registro.');
      }
    }
  }
}