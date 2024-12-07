import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ProductBuilder } from '../../builder/product.builder';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router
  ) {
    this.addProductForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['', [Validators.pattern(/^(.*)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif|bmp|webp)$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.addProductForm.valid) {
      const newProduct = new ProductBuilder()
        .setTitle(this.addProductForm.value.title)
        .setCategory(this.addProductForm.value.category)
        .setPrice(this.addProductForm.value.price)
        .setStock(this.addProductForm.value.stock)
        .setImage(this.addProductForm.value.image)
        .setDescription(this.addProductForm.value.description)
        .build();

      /*this.productsService.addProduct(
        newProduct.title,
        newProduct.description,
        newProduct.price,
        newProduct.category,
        newProduct.stock,
        newProduct.image
      );*/
      alert('Producto agregado exitosamente.');
      this.router.navigate(['/list-product']);
    }
  }

  goBack(): void {
    this.router.navigate(['/list-product']);
  }
}