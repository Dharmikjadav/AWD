import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.scss']
})

export class UserLogin {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  submitted: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://127.0.0.1:8000/api/login', payload,
      {
        headers: { 'Content-Type': 'application/json' } 
      }).subscribe({
        next: (res) => {
          this.authService.setToken(res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.error?.detail || 'Login failed ';
          alert(this.errorMessage);
        }
      });

  }
}
