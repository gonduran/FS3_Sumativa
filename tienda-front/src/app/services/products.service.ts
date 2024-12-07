import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product, ProductBuilder } from '../builder/product.builder';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrProducts = environment.apiProductos;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los productos desde el backend.
   * 
   * @returns Observable<Product[]> Lista de productos.
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<{ _embedded?: { productoList?: any[] } }>(this.apiUrProducts).pipe(
      map(response => {
        // Validar si la estructura es la esperada
        if (response && response._embedded && Array.isArray(response._embedded.productoList)) {
          return response._embedded.productoList.map(product =>
            new ProductBuilder()
              .setId(product.id)
              .setTitle(product.nombre)
              .setDescription(product.descripcion)
              .setPrice(product.precio)
              .setCategory(product.categorias?.[0]?.nombre || 'Sin categoría')
              .setImage(product.imagen)
              .setStock(product.stock)
              .build()
          );
        } else {
          console.error('Estructura inesperada en la respuesta del backend:', response);
          return []; // Retornar un arreglo vacío si la estructura no es válida
        }
      }),
      catchError(error => {
        console.error('Error al obtener productos:', error);
        return of([]); // Retornar un arreglo vacío en caso de error
      })
    );
  }

  /**
   * Obtiene un producto por su ID.
   * 
   * @param id ID del producto.
   * @returns Observable<Product> El producto correspondiente.
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrProducts}/${id}`).pipe(
      map(product =>
        new ProductBuilder()
          .setId(product.id)
          .setTitle(product.title)
          .setDescription(product.description)
          .setPrice(product.price)
          .setCategory(product.category)
          .setImage(product.image)
          .setStock(product.stock)
          .build()
      ),
      catchError(error => {
        console.error('Error al obtener producto:', error);
        throw error;
      })
    );
  }

  /**
   * Crea un nuevo producto.
   * 
   * @param product Datos del producto a crear.
   * @returns Observable<Product> El producto creado.
   */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrProducts, product).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error al crear producto:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza un producto existente.
   * 
   * @param id ID del producto a actualizar.
   * @param product Datos actualizados del producto.
   * @returns Observable<Product> El producto actualizado.
   */
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrProducts}/${id}`, product).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error al actualizar producto:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un producto por su ID.
   * 
   * @param id ID del producto a eliminar.
   * @returns Observable<void> Indica si la operación fue exitosa.
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrProducts}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar producto:', error);
        throw error;
      })
    );
  }
}