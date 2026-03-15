import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Login success:', res);
        this.authService.setToken(res.access_token);
        this.authService.setUsername(res.user.username);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.errorMessage = err?.error?.error || 'Login failed';
      }
    });
  }
}