import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = {
    'Papelería': [
      { title: 'Agenda 2025', price: 6490, category: 'Papelería', image: 'assets/images/agenda2025.webp', detailLink: '/product-detail/Agenda 2025', description: 'Agenda anual 2025 con diseño exclusivo.', features: ['Tamaño A5', 'Papel reciclado', 'Cubierta dura'] },
      { title: 'Cuaderno 120 Hojas', price: 5990, category: 'Papelería', image: 'assets/images/cuaderno1.webp', detailLink: '/product-detail/Cuaderno 120 Hojas', description: 'Cuaderno ideal para estudiantes.', features: ['Tamaño A4', '120 hojas', 'Cubierta blanda'] },
      { title: 'Cuaderno 150 hojas', price: 6990, category: 'Papelería', image: 'assets/images/cuaderno2.webp', detailLink: '/product-detail/Cuaderno 150 hojas', description: 'Perfecto para tus apuntes.', features: ['Tamaño carta', '150 hojas', 'Líneas y cuadriculado'] },
      { title: 'Block Sketching', price: 6990, category: 'Papelería', image: 'assets/images/blocksketching.webp', detailLink: '/product-detail/Block Sketching', description: 'Ideal para tus bocetos.', features: ['Papel de alta calidad', 'Formato A3', '50 hojas'] }
    ],
    'Oficina': [
      { title: 'Pizarra', price: 34990, category: 'Oficina', image: 'assets/images/pizarra.webp', detailLink: '/product-detail/Pizarra', description: 'Pizarra blanca para oficina.', features: ['Tamaño grande', 'Borrable', 'Marco de aluminio'] },
      { title: 'Archivador', price: 4990, category: 'Oficina', image: 'assets/images/archivador.webp', detailLink: '/product-detail/Archivador', description: 'Para organizar tus documentos.', features: ['Cuatro anillos', 'Tamaño carta', 'Cubierta rígida'] },
      { title: 'Marcadores', price: 2990, category: 'Oficina', image: 'assets/images/marcadores.webp', detailLink: '/product-detail/Marcadores', description: 'Set de marcadores de colores.', features: ['Punta fina', 'Colores variados', 'Borrables'] },
      { title: 'Resma Carta', price: 5990, category: 'Oficina', image: 'assets/images/resma.webp', detailLink: '/product-detail/Resma Carta', description: 'Papel tamaño carta.', features: ['500 hojas', '80g/m²', 'Color blanco'] }
    ],
    'Impresión': [
      { title: 'Tinta HP', price: 48990, category: 'Impresión', image: 'assets/images/tintahp.webp', detailLink: '/product-detail/Tinta HP', description: 'Tinta original HP.', features: ['Alta durabilidad', 'Colores vivos', 'Compatible con impresoras HP'] },
      { title: 'Toner Samsung', price: 43690, category: 'Impresión', image: 'assets/images/toner1.webp', detailLink: '/product-detail/Toner Samsung', description: 'Tóner Samsung.', features: ['Gran capacidad', 'Negro', 'Compatible con impresoras Samsung'] },
      { title: 'Toner Brother', price: 70990, category: 'Impresión', image: 'assets/images/toner2.webp', detailLink: '/product-detail/Toner Brother', description: 'Tóner Brother.', features: ['Para impresoras láser', 'Calidad profesional', 'Negro'] },
      { title: 'Papel Fotográfico', price: 5990, category: 'Impresión', image: 'assets/images/papelfoto.webp', detailLink: '/product-detail/Papel Fotográfico', description: 'Papel para impresión fotográfica.', features: ['Glossy', 'Compatible con inyección de tinta', 'Formato A4'] }
    ]
  };

  // Método para obtener un producto por su título
  getProductByTitle(title: string): any {
    for (const category of Object.keys(this.products) as Array<keyof typeof this.products>) {
      const product = this.products[category].find((p: any) => p.title === title);
      if (product) return product;
    }
    return null;
  }
}