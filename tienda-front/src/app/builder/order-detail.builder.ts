export interface Order2 {
    id: number;
  }

export interface OrderDetail {
    id: number;
    orden: Order2;
    idProducto: number;
    precio: number;
    cantidad: number;
    montoTotal: number;
  }

export class OrderDetailBuilder {
    private id: number = 0;
    private orden: Order2 = {id: 0};
    private idProducto: number = 0;
    private precio: number = 0;
    private cantidad: number = 0;
    private montoTotal: number = 0;
  
    setId(id: number): this {
      this.id = id;
      return this;
    }
  
    setOrden(orden: Order2): OrderDetailBuilder {
      this.orden = orden;
      return this;
    }

    setIdProducto(idProducto: number): this {
      this.idProducto = idProducto;
      return this;
    }
  
    setPrecio(precio: number): this {
      this.precio = precio;
      return this;
    }
  
    setCantidad(cantidad: number): this {
      this.cantidad = cantidad;
      return this;
    }
  
    setMontoTotal(montoTotal: number): this {
      this.montoTotal = montoTotal;
      return this;
    }
  
    build(): OrderDetail {
      return {
        id: this.id,
        orden: this.orden,
        idProducto: this.idProducto,
        precio: this.precio,
        cantidad: this.cantidad,
        montoTotal: this.montoTotal,
      };
    }
  }