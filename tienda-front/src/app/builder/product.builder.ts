// product.builder.ts
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
  }
  
  export class ProductBuilder {
    private id: string = '';
    private title: string = '';
    private description: string = '';
    private price: number = 0;
    private category: string = '';
    private image: string = '';
    private stock: number = 0;
  
    public setId(id: string): ProductBuilder {
      this.id = id;
      return this;
    }
  
    public setTitle(title: string): ProductBuilder {
      this.title = title;
      return this;
    }
  
    public setDescription(description: string): ProductBuilder {
      this.description = description;
      return this;
    }
  
    public setPrice(price: number): ProductBuilder {
      this.price = price;
      return this;
    }
  
    public setCategory(category: string): ProductBuilder {
      this.category = category;
      return this;
    }
  
    public setImage(image: string): ProductBuilder {
      this.image = image;
      return this;
    }
  
    public setStock(stock: number): ProductBuilder {
      this.stock = stock;
      return this;
    }
  
    public build(): Product {
      return {
        id: this.id,
        title: this.title,
        description: this.description,
        price: this.price,
        category: this.category,
        image: this.image,
        stock: this.stock,
      };
    }
  }