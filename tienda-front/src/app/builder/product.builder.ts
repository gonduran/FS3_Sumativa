export interface ProductByCategory {
  idCategoria: number;
  nombreCategoria: string;
  descripcionCategoria: string;
  idProducto: number;
  nombreProducto: string;
  imagenProducto: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  categorias: Categoria[];
}

export class ProductBuilder {
  private id: number = 0;
  private nombre: string = '';
  private descripcion: string = '';
  private precio: number = 0;
  private imagen: string = '';
  private stock: number = 0;
  private categorias: Categoria[] = [];

  public setId(id: number): ProductBuilder {
    this.id = id;
    return this;
  }

  public setTitle(nombre: string): ProductBuilder {
    this.nombre = nombre;
    return this;
  }

  public setDescription(descripcion: string): ProductBuilder {
    this.descripcion = descripcion;
    return this;
  }

  public setPrice(precio: number): ProductBuilder {
    this.precio = precio;
    return this;
  }

  public setImage(imagen: string): ProductBuilder {
    this.imagen = imagen;
    return this;
  }

  public setStock(stock: number): ProductBuilder {
    this.stock = stock;
    return this;
  }

  public setCategorias(categorias: Categoria[]): ProductBuilder {
    this.categorias = categorias;
    return this;
  }

  public build(): Product {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      imagen: this.imagen,
      stock: this.stock,
      categorias: this.categorias,
    };
  }
}