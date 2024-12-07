import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit, AfterViewInit {
  recoverPasswordForm: FormGroup;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private usersService: UsersService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {
    this.recoverPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

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
   * Maneja el envío del formulario de recuperación de contraseña.
   */
  onSubmit() {
    if (this.recoverPasswordForm.valid) {
      const email = this.recoverPasswordForm.value.email;

      this.usersService.findUser(email).subscribe({
        next: (user) => {
          if (user) {
            console.log('Usuario encontrado:', user);
            alert('Se ha enviado un enlace de recuperación de contraseña a su correo electrónico.');
            this.router.navigate(['/login']);
          } else {
            alert('El correo ingresado no está registrado en el sistema.');
            console.log('Usuario no encontrado.');
          }
        },
        error: (err) => {
          console.error('Error al verificar el usuario:', err);
          alert('Ocurrió un error al procesar su solicitud. Intente nuevamente.');
        },
      });
    } else {
      console.log('Formulario inválido');
      alert('Por favor ingrese un correo electrónico válido.');
    }
  }
}