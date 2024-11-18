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
  styleUrl: './recover-password.component.scss'
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
    private router: Router) { 
      this.recoverPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]});
	}

  ngOnInit(): void {
    
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

  onSubmit() {
    if (this.recoverPasswordForm.valid) {
      const email = this.recoverPasswordForm.value.email;

      //localStorage.setItem('user', JSON.stringify(userData));
      const clienteEncontrado = this.usersService.findUser(email);
      if (clienteEncontrado) {
        console.log('Cliente encontrado:', { email });
        alert('Se ha enviado un enlace de recuperación de contraseña a su correo electrónico.!');
        // Redirigir al perfil del usuario
        this.router.navigate(['/login']);
      } else {
        console.log('Error cliente no encontrado.');
      }
    } else {
      console.log('Formulario invalido');
    }
  }
}
