import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User, UserBuilder } from '../../builder/user.builder';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, AfterViewInit {
  users: User[] = [];

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (!this.authService.validateAuthentication()) {
      this.router.navigate(['/login']);
    }
    // Obtiene los usuarios directamente del servicio
    this.users = this.userService.getUsers();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
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

  /**
   * Edita la información del usuario.
   * @param user Usuario seleccionado para editar.
   */
  editUser(user: User): void {
    // Implementar lógica de edición o redirigir al formulario de edición.
    console.log('Editar usuario:', user);
  }

  /**
   * Elimina un usuario.
   * @param email Correo del usuario a eliminar.
   */
  deleteUser(email: string): void {
    const index = this.users.findIndex(user => user.email === email);
    if (index !== -1) {
      this.users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(this.users));
      alert(`Usuario con correo ${email} eliminado.`);
    }
  }
}