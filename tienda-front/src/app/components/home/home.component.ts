import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { ProductsService } from '../../services/products.service';
import { ProductByCategory } from '../../builder/product.builder';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  productsByCategory: ProductByCategory[] = [];

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private usersService: UsersService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadProductsByCategory();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        link.addEventListener('click', (event: Event) => {
          event.preventDefault();
          const target = event.target as HTMLElement;
          const href = target.getAttribute('href');
          if (href) {
            this.navigationService.navigateWithDelay(href);
          }
        });
      });
    }
  }

  loadProductsByCategory(): void {
    this.productsService.getProductsByCategory().subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        this.productsByCategory = data;
      },
      error: (err) => {
        console.error('Error al cargar los productos por categoría:', err);
      },
    });
  }
}