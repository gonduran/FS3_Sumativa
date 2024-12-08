import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Product, ProductBuilder, ProductByCategory } from '../builder/product.builder';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrlProducts = environment.apiProductos;
  private apiPedidosUrl = environment.apiPedidos;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los productos desde el backend.
   * 
   * @returns Observable<Product[]> Lista de productos.
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<{ _embedded?: { productoList?: any[] } }>(`${this.apiUrlProducts}/productos`).pipe(
      map(response => {
        // Validar si la estructura es la esperada
        if (response && response._embedded && Array.isArray(response._embedded.productoList)) {
          return response._embedded.productoList.map(product =>
            new ProductBuilder()
              .setId(product.id)
              .setTitle(product.nombre)
              .setDescription(product.descripcion)
              .setPrice(product.precio)
              .setCategorias(product.categorias)
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
  getProductById(id: number): Observable<Product> {
    console.log('Iniciando solicitud para obtener producto con ID:', id);
    return this.http.get<any>(`${this.apiUrlProducts}/productos/${id}`).pipe(
      map((product) => {
        console.log('Respuesta recibida del backend para el producto:', product);
        return new ProductBuilder()
          .setId(product.id)
          .setTitle(product.nombre)
          .setDescription(product.descripcion)
          .setPrice(product.precio)
          .setCategorias(product.categorias)
          .setImage(product.imagen)
          .setStock(product.stock)
          .build();
      }),
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
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
    return this.http.post<Product>(`${this.apiUrlProducts}/productos`, product).pipe(
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
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrlProducts}/productos/${id}`, product).pipe(
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
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlProducts}/productos/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar producto:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene todas las categorías desde el backend.
   *
   * @returns Observable<{ id: number; nombre: string }[]> Lista de categorías.
   */
  getAllCategories(): Observable<{ id: number; nombre: string; descripcion: string }[]> {
    return this.http.get<{ _embedded: { categoriaList: any[] } }>(`${this.apiUrlProducts}/categorias`).pipe(
      map((response) =>
        response._embedded.categoriaList.map((category) => ({
          id: category.id,
          nombre: category.nombre,
          descripcion: category.descripcion,
        }))
      ),
      catchError((error) => {
        console.error('Error al obtener categorías:', error);
        throw error;
      })
    );
  }

  getProductsByCategory(): Observable<ProductByCategory[]> {
    return this.http
      .get<ProductByCategory[]>(`${this.apiUrlProducts}/productos/product-by-category`)
      .pipe(
        tap((response) => {
          console.log('Respuesta del backend:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error al obtener productos por categoría:', error);
          return throwError(() => new Error('Error al cargar productos por categoría'));
        })
      );
  }

  /**
   * Obtiene los productos agrupados por categoría desde el backend.
   * @returns Observable con los productos agrupados por categoría.
   */
  getProductsGroupedByCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiPedidosUrl}/productos/productos-agrupados-categoria`);
  }

  /**
   * Busca productos en el backend según el filtro proporcionado.
   * @param filtro Término de búsqueda.
   * @returns Observable con la lista de productos encontrados.
   */
  findProducts(filtro: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPedidosUrl}/productos/buscar`, {
      params: { filtro }
    });
  }
}