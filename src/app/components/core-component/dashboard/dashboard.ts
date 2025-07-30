import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Booking } from '../../../service/booking';
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements AfterViewInit {
  showPopup: any;

  bookingForm = new FormGroup({
    fullname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    checkindate: new FormControl(''),
    checkoutdate: new FormControl(''),
    guests: new FormControl(''),
    room: new FormControl(''),
    hotelName : new FormControl('')
  });


  constructor(public booking : Booking) {

  }


  ngAfterViewInit(): void {
    // 1. Get modal element
    console.log("test")
    const modalEl = document.getElementById('exampleModalCenter');
    if (modalEl) {
      // 2. Get or create Bootstrap modal instance
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);

      // 3. Hide the modal in case it was open
      modalInstance.hide();
    }

    // 4. Remove leftover backdrop and modal-open class
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }

  AddBooking() {

  var payLoad = {
    fname : this.bookingForm.controls.fullname.value,
    email : this.bookingForm.controls.email.value,
    phonenumber : this.bookingForm.controls.phone.value,
    check_in_date : this.bookingForm.controls.checkindate.value,
    check_out_date : this.bookingForm.controls.checkoutdate.value,
    hotel : this.bookingForm.controls.checkoutdate.value,
    number_guests :  this.bookingForm.controls.guests.value,
    room_type :  this.bookingForm.controls.room.value,
  }
  
  this.booking.AddBooking(payLoad).subscribe((data)=>{
    console.log(data);
  })

  }

}
