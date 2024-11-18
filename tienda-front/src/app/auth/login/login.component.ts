import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
	  private fb: FormBuilder,
    private usersService: UsersService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cryptoService: CryptoService,
    private router: Router) { 
      this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]});
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
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
  
      const loginExitoso = this.usersService.iniciarSesion(email, password);
      if (loginExitoso) {
        const loggedInUser = this.usersService.getLoggedInClient();
  
        if (loggedInUser) { // Asegurarse de que loggedInUser no sea null
          console.log('Inicio de sesión exitoso:', { email, rol: loggedInUser.rol });
          alert('Inicio de sesión exitoso!');
  
          // Redirigir según el rol del usuario
          switch (loggedInUser.rol) {
            case 'client':
              this.router.navigate(['/profile']);
              break;
            case 'user':
              this.router.navigate(['/list-product']);
              break;
            case 'admin':
              this.router.navigate(['/list-user']);
              break;
            default:
              console.warn('Rol desconocido:', loggedInUser.rol);
              alert('Rol desconocido, contacte al administrador.');
          }
        } else {
          console.error('No se pudo recuperar el usuario logueado.');
          alert('Error al recuperar la información del usuario. Por favor, inicie sesión nuevamente.');
          this.router.navigate(['/login']);
        }
      } else {
        console.log('Error en el inicio de sesión.');
        alert('Email o contraseña incorrectos.');
      }
    } else {
      console.log('Formulario inválido.');
      alert('Por favor, complete los campos correctamente.');
    }
  }
}
