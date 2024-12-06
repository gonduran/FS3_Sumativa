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
  styleUrls: ['./list-user.component.scss'],
})
export class ListUserComponent implements OnInit, AfterViewInit {
  users: User[] = [];

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.validateAuthentication()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUsers();
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

  /**
   * Carga la lista de usuarios desde el backend.
   */
  loadUsers(): void {
    console.log('Ejecutando loadUsers...');
    this.userService.getUsers().subscribe({
      next: (usersData: any) => {
        console.log("Datos recibidos del backend:", usersData);
  
        // Verifica si la estructura de los datos contiene `_embedded.usuarioList`
        const usersArray = usersData?._embedded?.usuarioList;
  
        if (Array.isArray(usersArray)) {
          // Usa UserBuilder para construir los usuarios
          this.users = usersArray.map((userData) =>
            new UserBuilder()
              .setId(userData.id)
              .setNombre(userData.nombre)
              .setApellido(userData.apellido)
              .setEmail(userData.email)
              .setFechaNacimiento(userData.fechaNacimiento)
              .setDireccion(userData.direccion)
              .setRoles(userData.roles)
              .build()
          );
          console.log("Usuarios cargados:", this.users);
        } else {
          console.error("Estructura inesperada o datos vacíos:", usersData);
        }
      },
      error: (err) => {
        console.error("Error al cargar usuarios:", err);
      },
    });
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
   * @param id Id del usuario a eliminar.
   */
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: (success: boolean) => {
        if (success) {
          // Filtra el usuario eliminado de la lista local
          this.users = this.users.filter(user => user.id !== id);
          alert(`Usuario con ID ${id} eliminado.`);
        } else {
          alert(`Error al intentar eliminar el usuario con ID ${id}.`);
        }
      },
      error: (error) => {
        console.error('Error al eliminar el usuario:', error);
        alert(`Error inesperado al eliminar el usuario con ID ${id}.`);
      }
    });
  }
}