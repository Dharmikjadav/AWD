import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss']
})
export class Registration {
  registrationForm!: FormGroup;

  private apiUrl = 'http://127.0.0.1:8000/api/register';
  submitted: any;
  f: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
   
    this.registrationForm = this.fb.group({
      fullname: [''],
      email: [''],
      phone: [''],
      password: [''],
      confirmPassword: ['']  
    });

  }

  onSubmit() {
    const payload = this.registrationForm.value;

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        alert('Registration Successful ');
        this.router.navigate(['/user-login']);
      },
      error: (err) => {
        alert('Registration failed : ' + (err.error?.detail || 'Unknown error'));
      }
    });
  }
}
