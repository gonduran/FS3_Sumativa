import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User, UserBuilder } from '../../builder/user.builder';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  users: User[] = [];

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UsersService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Obtiene los usuarios directamente del servicio
    this.users = this.userService.getUsers();
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