import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ProductBuilder } from '../../builder/product.builder';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  editProductForm: FormGroup;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editProductForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['', [Validators.pattern(/^(.*)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif|bmp|webp)$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      /*const product = this.productsService.getProducts().find(p => p.id === this.productId);
      if (product) {
        this.editProductForm.patchValue(product);
      } else {
        alert('Producto no encontrado.');
        this.goBack();
      }*/
    }
  }

  onSubmit(): void {
    if (this.editProductForm.valid) {
      const formValues = this.editProductForm.value;
  
      const updatedProduct = new ProductBuilder()
        .setId(this.productId || '') // Asegúrate de que el ID del producto esté configurado
        .setTitle(formValues.title)
        .setDescription(formValues.description)
        .setPrice(formValues.price)
        .setCategory(formValues.category)
        .setStock(formValues.stock)
        .setImage(formValues.image)
        .build();
  
      /*const success = this.productsService.updateProduct(updatedProduct);
  
      if (success) {
        alert('Producto actualizado correctamente.');
        this.router.navigate(['/list-product']);
      } else {
        alert('Error al actualizar el producto.');
      }*/
    }
  }

  goBack(): void {
    this.router.navigate(['/list-product']);
  }
}