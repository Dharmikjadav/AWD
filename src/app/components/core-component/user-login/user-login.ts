import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.scss']
})

export class UserLogin {
  // Common states
  loginMethod: 'email' | 'mobile' = 'email';
  submitted: boolean = false;
  errorMessage: string | null = null;

  // Email login states
  email: string = '';
  password: string = '';

  // Mobile login states
  phone: string = '';
  otp: string = '';
  showOtpField: boolean = false;
  isSendingOtp: boolean = false;
  isLoading: boolean = false;

  // Forgot password states
  showForgotModal: boolean = false;
  forgotEmail: string = '';
  isSendingReset: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    return /^[0-9]{10,15}$/.test(phone);
  }

  toggleLoginMethod(method: 'email' | 'mobile') {
    this.loginMethod = method;
    this.errorMessage = null;
    this.submitted = false;
  }

  sendOTP() {
    if (!this.phone || !this.isValidPhone(this.phone)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone',
        text: 'Please enter a valid phone number registered with your account',
      });
      return;
    }

    this.isSendingOtp = true;
    this.isLoading = true;
    this.http.post<any>('http://127.0.0.1:8001/api/send-otp', { phone: this.phone }).subscribe({
      next: (res) => {
        this.isSendingOtp = false;
        this.isLoading = false;
        this.showOtpField = true;
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: 'Check your registered email for the 6-digit code',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.isSendingOtp = false;
        Swal.fire({
          icon: 'error',
          title: 'Request Failed',
          text: err.error?.detail || 'Could not send OTP. Make sure your phone number is registered.'
        });
        this.isLoading = false;
      }
    });
  }


  openForgotPassword() {
    this.showForgotModal = true;
    this.forgotEmail = this.email || '';
  }

  closeForgotPassword() {
    this.showForgotModal = false;
    this.isSendingReset = false;
  }

  sendPasswordReset() {
    if (!this.forgotEmail || !this.isValidEmail(this.forgotEmail)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.'
      });
      return;
    }

    this.isSendingReset = true;
    this.http.post<any>('http://127.0.0.1:8001/api/forgot-password', { email: this.forgotEmail }).subscribe({
      next: (res) => {
        this.isSendingReset = false;
        Swal.fire({
          icon: 'success',
          title: 'Reset Link Sent',
          text: res?.message || 'Check your email for the password reset link.'
        });
        this.closeForgotPassword();
      },
      error: (err) => {
        this.isSendingReset = false;
        Swal.fire({
          icon: 'error',
          title: 'Request Failed',
          text: err.error?.detail || 'Could not send reset link. Please try again.'
        });
      }
    });
  }

  login() {
    this.submitted = true;

    if (this.loginMethod === 'mobile') {
      this.verifyOTP();
      return;
    }

    // Original Email Login logic
    if (!this.email || !this.password) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Please fill in all required fields' });
      return;
    }

    const payload = { email: this.email, password: this.password };
    this.executeLogin('http://127.0.0.1:8001/api/login', payload);
  }

  verifyOTP() {
    if (!this.otp || this.otp.length !== 6) {
      Swal.fire({ icon: 'error', title: 'Invalid OTP', text: 'Please enter the 6-digit code sent to your email' });
      return;
    }

    const payload = { phone: this.phone, otp: this.otp };
    this.executeLogin('http://127.0.0.1:8001/api/verify-otp', payload);
  }

  private executeLogin(url: string, payload: any) {
    this.isLoading = true;
    this.http.post<any>(url, payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.authService.setToken(res.token);
        localStorage.setItem('email', res.user.email);

        Swal.fire({
          icon: 'success',
          title: res.message || 'Login successful',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          if (res.user.email === 'admin@gmail.com') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Login failed';
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: this.errorMessage || 'Invalid credentials'
        });
      }
    });
  }
}

