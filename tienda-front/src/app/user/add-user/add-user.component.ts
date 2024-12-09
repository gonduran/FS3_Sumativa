import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[#$!%*?&])[A-Za-z\d$!%*?&]{6,18}$/),
        ],
      ],
      birthdate: [''], // Opcional
      dispatchAddress: [''], // Opcional
      rol: ['1', Validators.required], // Predeterminado a Cliente
    });
  }

  ngOnInit(): void {}

  /**
   * Maneja el envío del formulario para registrar un usuario.
   */
  onSubmit(): void {
    if (this.addUserForm.valid) {
      const formData = this.addUserForm.value;

      this.usersService
        .registerUser(
          formData.name,
          formData.surname,
          formData.email,
          formData.password,
          '', // Si no se proporciona, se envía como cadena vacía
          '', // Si no se proporciona, se envía como cadena vacía
          Number(formData.rol) // Convertir rol a número
        )
        .subscribe({
          next: (success: boolean) => {
            if (success) {
              alert('Usuario registrado exitosamente');
              this.addUserForm.reset();
              this.router.navigate(['/list-user']);
            } else {
              alert('Error: el correo ya está registrado.');
            }
          },
          error: (err) => {
            console.error('Error inesperado al registrar el usuario:', err);
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