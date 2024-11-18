import { Injectable } from '@angular/core';
import { ProductBuilder, Product } from '../builder/product.builder';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private storageKey = 'products';
  private products: Product[] = [];

  /**
   * @description Constructor del servicio. Carga los productos desde localStorage.
   */
  constructor() {
    if (this.isLocalStorageAvailable()) {
      const productsSaved = localStorage.getItem(this.storageKey);
      this.products = productsSaved ? JSON.parse(productsSaved) : [];
    } else {
      this.products = [];
    }
    // Cargar productos iniciales si no existen
    //this.initializeSampleProducts();
  }

  /**
   * @description Verifica si localStorage está disponible.
   * @return {boolean} Retorna true si localStorage está disponible, de lo contrario false.
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @description Obtiene todos los productos.
   * @return {Product[]} Array de productos.
   */
  getProducts(): Product[] {
    return [...this.products];
  }

  /**
   * @description Obtiene un producto por su ID.
   * @param id - ID del producto.
   * @return {Product | undefined} El producto encontrado o undefined si no existe.
   */
  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  /**
   * @description Agrega un nuevo producto.
   * @param title - Título del producto.
   * @param description - Descripción del producto.
   * @param price - Precio del producto.
   * @param category - Categoría del producto.
   * @param stock - Stock disponible del producto.
   * @param image - URL de la imagen del producto.
   */
  addProduct(
    title: string,
    description: string,
    price: number,
    category: string,
    stock: number,
    image: string
  ): void {
    const newProduct = new ProductBuilder()
      .setId(this.generateProductId())
      .setTitle(title)
      .setDescription(description)
      .setPrice(price)
      .setCategory(category)
      .setStock(stock)
      .setImage(image)
      .build();

    this.products.push(newProduct);
    this.saveProductsToStorage();
  }

  /**
   * @description Actualiza un producto existente.
   * @param updatedProduct - Producto actualizado.
   * @return {boolean} Retorna true si el producto fue actualizado exitosamente.
   */
  updateProduct(updatedProduct: Product): boolean {
    const index = this.products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.saveProductsToStorage();
      return true;
    } else {
      console.warn(`Producto con ID ${updatedProduct.id} no encontrado.`);
      return false;
    }
  }

  /**
   * @description Elimina un producto por su ID.
   * @param id - ID del producto a eliminar.
   */
  deleteProduct(id: string): void {
    this.products = this.products.filter(product => product.id !== id);
    this.saveProductsToStorage();
  }

  /**
   * @description Genera un ID único para un producto.
   * @return {string} ID único.
   */
  private generateProductId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * @description Guarda los productos en localStorage.
   */
  private saveProductsToStorage(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.products));
    }
  }

  /**
   * @description Inicializa productos de ejemplo en localStorage si está vacío.
   */
  private initializeSampleProducts(): void {
    if (this.products.length === 0) {
      const sampleProducts = [
        new ProductBuilder()
          .setId(this.generateProductId())
          .setTitle('Producto A')
          .setDescription('Descripción del producto A')
          .setPrice(1500)
          .setCategory('Categoría 1')
          .setStock(100)
          .setImage('assets/images/product-a.jpg')
          .build(),
        new ProductBuilder()
          .setId(this.generateProductId())
          .setTitle('Producto B')
          .setDescription('Descripción del producto B')
          .setPrice(2500)
          .setCategory('Categoría 2')
          .setStock(50)
          .setImage('assets/images/product-b.jpg')
          .build(),
      ];

      this.products = sampleProducts;
      this.saveProductsToStorage();
      console.log('Productos de ejemplo inicializados.');
    }
  }
}