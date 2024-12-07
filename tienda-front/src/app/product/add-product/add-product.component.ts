import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ProductBuilder, Categoria } from '../../builder/product.builder';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;
  categories: Categoria[] = [];

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
      image: ['assets/images/no_imagen.jpg', [Validators.pattern(/^(.*)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif|bmp|webp)$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Carga las categorías desde el backend.
   */
  loadCategories(): void {
    this.productsService.getAllCategories().subscribe({
      next: (data) => {
        console.log('Categorías cargadas:', data);
        //this.categories = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        alert('Ocurrió un error al cargar las categorías. Inténtelo nuevamente.');
      },
    });
  }

  /**
   * Maneja el envío del formulario para agregar un nuevo producto.
   */
  onSubmit(): void {
    if (this.addProductForm.valid) {
      const formData = this.addProductForm.value;

      // Usa un valor por defecto para la imagen si está vacía
      const imageValue = formData.image.trim() === '' ? 'assets/images/no_imagen.jpg' : formData.image;

      const newProduct = new ProductBuilder()
        .setTitle(formData.title)
        .setCategorias([{ id: Number(formData.category), nombre: '', descripcion: '' }])
        .setPrice(formData.price)
        .setStock(formData.stock)
        .setImage(imageValue)
        .setDescription(formData.description)
        .build();

      console.log('Producto a crear:', newProduct);

      // Llamar al servicio para enviar el producto al backend
      this.productsService.createProduct(newProduct).subscribe({
        next: (createdProduct) => {
          console.log('Producto creado exitosamente:', createdProduct);
          alert('Producto agregado exitosamente.');
          this.router.navigate(['/list-product']);
        },
        error: (err) => {
          console.error('Error al agregar el producto:', err);
          alert('Ocurrió un error al agregar el producto. Inténtelo nuevamente.');
        },
      });
    } else {
      alert('Por favor complete todos los campos correctamente.');
    }
  }

  /**
   * Regresa a la lista de productos.
   */
  goBack(): void {
    this.router.navigate(['/list-product']);
  }
}