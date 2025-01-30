import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { InfoDialogData } from '../../../../shared/components/info-dialog/info-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../../../shared/components/info-dialog/info-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/movies']);
        },
        error: (error) => {
          console.error('Login failed', error);
          if (error.status === 404) {
            this.openDialog('Usuario no encontrado.');
          } else if (error.status === 401) {
            this.openDialog('Contraseña incorrecta.');
          } else {
            this.openDialog('Error en el servidor. Inténtalo de nuevo más tarde.');
          }
        }
      });
    }
  }

  openDialog(errorMessage: string): void {
    const dialogData: InfoDialogData = {
      message: errorMessage,
      actions: [
        {
          tag: 'Aceptar',
          action: () => console.log('Acción Aceptada')
        },
      ]
    };
  
    this.dialog.open(InfoDialogComponent, {
      data: dialogData
    });
  }
}
