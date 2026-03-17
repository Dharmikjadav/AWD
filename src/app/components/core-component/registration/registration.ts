import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss']
})
export class Registration {
  registrationForm!: FormGroup;

  private apiUrl = 'http://127.0.0.1:8001/api/register';
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {

    this.registrationForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      confirmPassword: ['', Validators.required]
    });

  }

  get f() { return this.registrationForm.controls; }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  private isValidIndianPhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  }


  onSubmit() {

    this.submitted = true;

    if (this.registrationForm.invalid) {

      Swal.fire({
        icon: 'error',
        title: 'Form Incomplete',
        text: 'Please correct the highlighted fields before submitting.',
        confirmButtonColor: '#0b1d3a'
      });

      return;
    }

    const payload = this.registrationForm.value;

    this.http.post(this.apiUrl, payload).subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your account has been created successfully.',
          confirmButtonColor: '#0b1d3a'
        }).then(() => {
          this.router.navigate(['/user-login']);
        });
      },

      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: err.error?.detail || 'Something went wrong',
          confirmButtonColor: '#0b1d3a'
        });
      }

    });

  }
}

