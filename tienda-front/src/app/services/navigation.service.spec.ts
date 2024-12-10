import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavigationService', () => {
  let service: NavigationService;
  let router: Router;
  let mockLoadingScreen: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [NavigationService]
    });

    service = TestBed.inject(NavigationService);
    router = TestBed.inject(Router);

    // Crear y añadir el elemento loading-screen
    mockLoadingScreen = document.createElement('div');
    mockLoadingScreen.id = 'loading-screen';
    document.body.appendChild(mockLoadingScreen);
  });

  afterEach(() => {
    // Limpiar el DOM después de cada prueba
    if (mockLoadingScreen && mockLoadingScreen.parentNode) {
      mockLoadingScreen.parentNode.removeChild(mockLoadingScreen);
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*describe('navigateWithDelay', () => {
    it('should navigate to internal URL with loading screen', fakeAsync(() => {
      // Arrange
      const internalUrl = '/test-route';
      spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

      // Act
      service.navigateWithDelay(internalUrl);

      // Assert - verificar clase active añadida
      expect(mockLoadingScreen.classList.contains('active')).toBeTruthy();

      // Simular paso del tiempo
      tick(1000);

      // Assert - verificar navegación
      expect(router.navigateByUrl).toHaveBeenCalledWith(internalUrl);
      
      // Resolver la promesa de navegación
      tick();

      // Assert - verificar que la clase active fue removida
      expect(mockLoadingScreen.classList.contains('active')).toBeFalsy();
    }));

    it('should navigate to external URL', fakeAsync(() => {
      // Arrange
      const externalUrl = 'https://example.com';
      const originalLocation = window.location;
      let locationHref = '';

      // Mock window.location
      delete (window as any).location;
      (window as any).location = { ...originalLocation, href: locationHref };
      Object.defineProperty(window.location, 'href', {
        set(href: string) { locationHref = href; },
        get() { return locationHref; }
      });

      // Act
      service.navigateWithDelay(externalUrl);
      tick(1000);

      // Assert
      expect(locationHref).toBe(externalUrl);

      // Restaurar window.location
      window.location = originalLocation;
    }));

    it('should use custom delay', fakeAsync(() => {
      // Arrange
      const internalUrl = '/test-route';
      const customDelay = 2000;
      spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

      // Act
      service.navigateWithDelay(internalUrl, customDelay);

      // Assert - verificar que la navegación no ha ocurrido aún
      tick(1000);
      expect(router.navigateByUrl).not.toHaveBeenCalled();

      // Completar el delay
      tick(1000);
      expect(router.navigateByUrl).toHaveBeenCalledWith(internalUrl);
    }));

    it('should handle missing loading screen', fakeAsync(() => {
      // Arrange
      const internalUrl = '/test-route';
      spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
      document.body.removeChild(mockLoadingScreen);

      // Act
      service.navigateWithDelay(internalUrl);
      tick(1000);

      // Assert - verificar que no hay errores y la navegación ocurre
      expect(router.navigateByUrl).toHaveBeenCalledWith(internalUrl);
    }));

    it('should handle navigation failure', fakeAsync(() => {
      // Arrange
      const internalUrl = '/test-route';
      spyOn(router, 'navigateByUrl').and.returnValue(Promise.reject('Navigation failed'));

      // Act
      service.navigateWithDelay(internalUrl);
      tick(1000);

      // Assert - verificar que la clase active es removida incluso si la navegación falla
      try {
        tick();
      } catch (e) {
        expect(mockLoadingScreen.classList.contains('active')).toBeFalsy();
      }
    }));

    it('should handle loading screen removal for external URLs', fakeAsync(() => {
      // Arrange
      const externalUrl = 'https://example.com';
      
      // Act
      service.navigateWithDelay(externalUrl);

      // Assert - verificar que la clase active fue añadida
      expect(mockLoadingScreen.classList.contains('active')).toBeTruthy();

      // Simular delay
      tick(1000);

      // La clase active debería permanecer para URLs externas ya que la página se recargará
      expect(mockLoadingScreen.classList.contains('active')).toBeTruthy();
    }));
  });*/
});