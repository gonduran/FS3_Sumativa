import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ProductBuilder, Categoria } from '../../builder/product.builder';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  editProductForm: FormGroup;
  categories: Categoria[] = [];
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editProductForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['', [Validators.pattern(/^(.*)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png|gif|bmp|webp)$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.loadProduct();
    } else {
      alert('ID de producto no válido.');
      this.goBack();
    }
    this.loadCategories();
  }

  /**
   * Carga las categorías desde el backend.
   */
  loadCategories(): void {
    this.productsService.getAllCategories().subscribe({
      next: (data) => {
        console.log('Categorías cargadas:', data);
        this.categories = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        alert('Ocurrió un error al cargar las categorías. Inténtelo nuevamente.');
      },
    });
  }

  /**
   * Carga los datos del producto desde el backend.
   */
  loadProduct(): void {
    this.productsService.getProductById(this.productId!).subscribe({
      next: (product) => {
        console.log('Producto cargado:', product);
        this.editProductForm.patchValue({
          id: product.id,
          title: product.nombre,
          category: product.categorias[0]?.id,
          price: product.precio,
          stock: product.stock,
          image: product.imagen,
          description: product.descripcion,
        });
      },
      error: (err) => {
        console.error('Error al cargar el producto:', err);
        alert('No se pudo cargar el producto. Inténtelo nuevamente.');
        this.goBack();
      },
    });
  }

  /**
   * Maneja el envío del formulario para actualizar un producto.
   */
  onSubmit(): void {
    if (this.editProductForm.valid) {
      const formData = this.editProductForm.getRawValue();
      formData.id = this.productId;

      // Usando ProductBuilder para construir el producto
      const updatedProduct = new ProductBuilder()
        .setId(formData.id)
        .setTitle(formData.title)
        .setCategorias([{ id: Number(formData.category), nombre: '', descripcion: '' }])
        .setPrice(formData.price)
        .setStock(formData.stock)
        .setImage(formData.image || 'assets/images/no_imagen.jpg') // Imagen por defecto si está vacía
        .setDescription(formData.description)
        .build();

      this.productsService.updateProduct(this.productId!, updatedProduct).subscribe({
        next: () => {
          alert('Producto actualizado correctamente.');
          this.router.navigate(['/list-product']);
        },
        error: (err) => {
          console.error('Error al actualizar el producto:', err);
          alert('Ocurrió un error al actualizar el producto. Inténtelo nuevamente.');
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