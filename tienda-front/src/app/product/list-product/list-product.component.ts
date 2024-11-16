import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../builder/product.builder';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
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