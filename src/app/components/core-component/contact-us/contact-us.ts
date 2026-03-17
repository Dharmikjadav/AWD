import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { Booking } from '../../../service/booking';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss'
})


export class ContactUs implements OnInit {

  constructor(public booking: Booking) { }
  ContactUs!: FormGroup
  successMessage: string | null = null;

  ngOnInit(): void {
    this.ContactUs = new FormGroup({
      fullname: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z ]+$')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }


  contectus() {
    if (this.ContactUs.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields correctly before sending.',
        confirmButtonColor: '#d4a843'
      });
      return;
    }

    const payload = {
      fname: this.ContactUs.controls['fullname'].value,
      email: this.ContactUs.controls['email'].value,
      message: this.ContactUs.controls['message'].value,
    }

    this.booking.contect(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'Thank you for reaching out. We will get back to you soon.',
          timer: 3000,
          showConfirmButton: false
        });
        console.log(res);
        this.ContactUs.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong. Please try again later.',
          confirmButtonColor: '#d4a843'
        });
        console.error(err);
      }
    });
  }



}
