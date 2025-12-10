import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Booking } from '../../../service/booking';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss'
})

export class ContactUs implements OnInit {

  constructor(public booking: Booking) { }
  ContactUs!: FormGroup
  successMessage: string | null = null;

  ngOnInit(): void {
    this.ContactUs = new FormGroup({
      fullname: new FormControl(''),
      email: new FormControl(''),
      message: new FormControl('')
    });
  }

  contectus() {
    const payload = {
      fname: this.ContactUs.controls['fullname'].value,
      email: this.ContactUs.controls['email'].value,
      message: this.ContactUs.controls['message'].value,
    }
    this.booking.contect(payload).subscribe({
      next: (res) => {
        this.successMessage = "Message sent !!!!";
        alert("Message sent !!!");
        console.log(res);
        this.ContactUs.reset();
      },
    })
  }


}
