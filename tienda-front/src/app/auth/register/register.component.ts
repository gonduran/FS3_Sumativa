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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, AfterViewInit {
  registerForm: FormGroup;

  /**
   * @description 
   * Constructor del componente RegisterComponent.
   * 
   * @param {NavigationService} navigationService - Servicio de navegación.
   * @param {Object} platformId - Identificador de la plataforma.
   * @param {FormBuilder} fb - Constructor de formularios reactivos.
   * @param {UsersService} usersService - Servicio de clientes.
   * @param {Renderer2} renderer - Servicio de renderizado.
   * @param {ElementRef} el - Referencia al elemento HTML.
   * @param {CryptoService} cryptoService - Servicio de encriptación.
   * @param {Router} router - Servicio de enrutamiento.
   */
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private usersService: UsersService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router) {
    this.registerForm = this.fb.group({
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
      confirmPassword: ['', Validators.required],
      birthdate: ['', Validators.required],
      dispatchAddress: ['']
    }, { validator: this.passwordMatchValidator });
  }

  /**
   * @description 
   * Hook de inicialización del componente. Verifica el estado de inicio de sesión.
   * 
   * @return {void}
   */
  ngOnInit(): void {

  }

  /**
   * @description 
   * Hook que se ejecuta después de que la vista ha sido inicializada. Configura la navegación con retardo para los enlaces.
   * 
   * @return {void}
   */
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
   * @description 
   * Valida que las contraseñas coincidan.
   * 
   * @param {FormGroup} form - El formulario de registro.
   * @return {null | Object} - Retorna null si las contraseñas coinciden, de lo contrario un objeto con el error.
   */
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  /**
   * @description 
   * Calcula la edad del cliente basado en su fecha de nacimiento.
   * 
   * @param {string} birthdate - La fecha de nacimiento del cliente.
   * @return {number} - La edad del cliente.
   */
  calculateAge(birthdate: string): number {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * @description 
   * Maneja el envío del formulario de registro. Realiza las validaciones y registra al cliente.
   * 
   * @return {void}
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      const age = this.calculateAge(this.registerForm.value.birthdate);
      if (age < 13) {
        alert('Debe tener al menos 13 años para registrarse.');
        return;
      }

      const name = this.registerForm.value.name;
      const surname = this.registerForm.value.surname;
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;
      const birthdate = this.formatToFormDate(this.registerForm.value.birthdate);
      const dispatchAddress = this.registerForm.value.dispatchAddress;

      this.usersService
        .registerUser(name, surname, email, password, birthdate, dispatchAddress, 3)
        .subscribe({
          next: (registroExitoso: boolean) => {
            if (registroExitoso) {
              console.log('Registro exitoso:', { name, surname, email, password, birthdate, dispatchAddress });
              alert('Registro exitoso!');
              this.registerForm.reset();
            } else {
              console.log('Error en el registro.');
              alert('Error en el registro. Es posible que el usuario ya exista.');
            }
          },
          error: (error) => {
            console.error('Error inesperado en el registro:', error);
            alert('Ocurrió un error inesperado. Inténtelo nuevamente.');
          },
        });
    } else {
      alert('Por favor complete todos los campos correctamente.');
      console.log('Formulario inválido');
    }
  }

  /**
   * @description 
   * Restablece el formulario de registro.
   * 
   * @return {void}
   */
  onReset(): void {
    this.registerForm.reset({
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      dispatchAddress: ''
    });
  }

  /**
   * @description 
   * Formatea una fecha de almacenamiento en el formato DD-MM-YYYY.
   * 
   * @param {string} date - La fecha en formato YYYY-MM-DD.
   * @return {string} - La fecha formateada en el formato DD-MM-YYYY.
   */
  formatToFormDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  /**
   * @description 
   * Formatea una fecha de formulario en el formato YYYY-MM-DD.
   * 
   * @param {string} date - La fecha en formato DD-MM-YYYY.
   * @return {string} - La fecha formateada en el formato YYYY-MM-DD.
   */
  formatToStorageDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}
