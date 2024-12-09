import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { UserBuilder } from '../../builder/user.builder';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editUserForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(18),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[#$!%*?&])[A-Za-z\d$!%*?&]{6,18}$/),
        ],
      ],
      rol: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.userId) {
      this.loadUserData(this.userId);
    } else {
      console.error('ID del usuario no encontrado');
      this.router.navigate(['/list-user']);
    }
  }

  /**
   * Carga los datos del usuario desde el backend y los establece en el formulario.
   * @param id ID del usuario a editar.
   */
  loadUserData(id: number): void {
    this.usersService.getUserById(id).subscribe({
      next: (user) => {
        this.editUserForm.patchValue({
          id: user.id,
          name: user.nombre,
          surname: user.apellido,
          email: user.email,
          rol: user.roles[0]?.id || '',
        });
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario:', err);
        alert('No se pudo cargar el usuario. Intente nuevamente.');
        this.router.navigate(['/list-user']);
      },
    });
  }

  /**
   * Maneja el envío del formulario para actualizar el usuario.
   */
  onSubmit(): void {
    if (this.editUserForm.valid) {
      const formValues = this.editUserForm.getRawValue();

      this.usersService
        .updateUser(
          formValues.id,
          formValues.name,
          formValues.surname,
          formValues.email,
          formValues.password || '',
          '', // Suplir el birthdate si no está siendo manejado
          '', // Suplir dispatchAddress si no está siendo manejado
          formValues.rol
        )
        .subscribe({
          next: (success: boolean) => {
            if (success) {
              alert('Usuario actualizado correctamente');
              this.router.navigate(['/list-user']);
            } else {
              alert('Error al actualizar el usuario.');
            }
          },
          error: (err) => {
            console.error('Error inesperado al actualizar el usuario:', err);
            alert('Ocurrió un error inesperado. Intente nuevamente.');
          },
        });
    } else {
      alert('Por favor complete todos los campos correctamente.');
    }
  }

  /**
   * Regresa a la lista de usuarios.
   */
  goBack(): void {
    this.router.navigate(['/list-user']);
  }
}