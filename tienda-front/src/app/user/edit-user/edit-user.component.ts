import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptoService
  ) {
    this.editUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[#$!%*?&])[A-Za-z\d$!%*?&]{6,18}$/),
        ],
      ],
      rol: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      const user = this.usersService.getUsers().find(u => u.email === this.userId);
      if (user) {
        this.editUserForm.patchValue(user);
      }
    }
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      const updatedUser = this.editUserForm.getRawValue();
      this.usersService.updateUser(
        updatedUser.name,
        updatedUser.surname,
        updatedUser.email,
        this.cryptoService.encrypt(updatedUser.password),
        '',
        '',
        updatedUser.rol
      );
      alert('Usuario actualizado correctamente');
      this.router.navigate(['/list-user']);
    }
  }

  goBack(): void {
    this.router.navigate(['/list-user']);
  }
}