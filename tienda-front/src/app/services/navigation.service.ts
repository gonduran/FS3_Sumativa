import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  /**
   * @description 
   * Navega a una URL específica después de un retraso opcional, mostrando una pantalla de carga mientras tanto.
   * 
   * @param {string} href - La URL a la que se debe navegar.
   * @param {number} [delay=1000] - El retraso en milisegundos antes de navegar. El valor predeterminado es 1000 ms.
   * @return {void}
   */
  navigateWithDelay(href: string, delay: number = 1000): void {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
      loadingScreen.classList.add('active');
    }
    
    setTimeout(() => {
      // Verificar si el href es una URL relativa que debe ser manejada por el router
      if (href.startsWith('/')) {
        this.router.navigateByUrl(href).then(() => {
          if (loadingScreen) {
            loadingScreen.classList.remove('active');
          }
        });
      } else {
        window.location.href = href;
      }
    }, delay);
  }
}
