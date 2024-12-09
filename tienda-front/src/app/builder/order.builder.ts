export interface Order {
    id: number;
    email: string;
    montoTotal: number;
    fecha: string;
    estado: number;
  }

export class OrderBuilder {
    private id: number = 0;
    private email: string = '';
    private montoTotal: number = 0;
    private fecha: string = '';
    private estado: number = 0;
  
    setId(id: number): this {
      this.id = id;
      return this;
    }
  
    setEmail(email: string): this {
      this.email = email;
      return this;
    }
  
    setMontoTotal(montoTotal: number): this {
      this.montoTotal = montoTotal;
      return this;
    }
  
    setFecha(fecha: string): this {
      this.fecha = fecha;
      return this;
    }
  
    setEstado(estado: number): this {
      this.estado = estado;
      return this;
    }
  
    build(): Order {
      return {
        id: this.id,
        email: this.email,
        montoTotal: this.montoTotal,
        fecha: this.fecha,
        estado: this.estado,
      };
    }
  }