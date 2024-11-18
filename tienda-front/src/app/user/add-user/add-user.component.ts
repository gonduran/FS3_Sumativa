import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private cryptoService: CryptoService
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
      rol: ['user', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.addUserForm.valid) {
      const formData = this.addUserForm.value;
      const userAdded = this.usersService.registerUser(
        formData.name,
        formData.surname,
        formData.email,
        this.cryptoService.encrypt(formData.password),
        '',
        '',
        formData.rol
      );

      if (userAdded) {
        alert('Usuario registrado exitosamente');
        this.addUserForm.reset();
        this.router.navigate(['/list-user']);
      } else {
        alert('Error: el correo ya está registrado');
      }
    } else {
      alert('Por favor complete todos los campos correctamente.');
    }
  }

  goBack(): void {
    this.router.navigate(['/list-user']);
  }
}