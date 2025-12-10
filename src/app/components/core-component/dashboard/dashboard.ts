import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Booking } from '../../../service/booking';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, AfterViewInit {
  submitted = false;
  successMessage: string | null = null;

  bookingForm = new FormGroup({
    fullname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    checkindate: new FormControl(''),
    checkoutdate: new FormControl(''),
    guests: new FormControl(''),
    room: new FormControl(''),
    hotelName: new FormControl('')
  });

  constructor(
    private fb: FormBuilder,
    public booking: Booking,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bookingForm = this.fb.group(
      {
        fullname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        checkindate: ['', Validators.required],
        checkoutdate: ['', Validators.required],
        guests: ['', Validators.required],
        hotelName: ['', Validators.required],
        room: ['', Validators.required]
      },
      { validators: this.checkOutAfterCheckIn }
    );

    const modalEl = document.getElementById('exampleModalCenter');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.clearData();
      });
    }
  }

  checkOutAfterCheckIn(group: AbstractControl) {
    const checkin = group.get('checkindate')?.value;
    const checkout = group.get('checkoutdate')?.value;
    if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
      group.get('checkoutdate')?.setErrors({ dateAfterCheckin: true });
    }
    return null;
  }

  get f() {
    return this.bookingForm.controls;
  }

  ngAfterViewInit(): void {

  }

  AddBooking() {
    this.submitted = true;

    if (!this.authService.isLoggedIn()) {
      alert("You must login first ");
      this.router.navigate(['/user-login']);
      return;
    }

    if (this.bookingForm.invalid) return;

    const payload = {
      fname: this.bookingForm.controls.fullname.value,
      phonenumber: this.bookingForm.controls.phone.value,
      check_in_date: this.bookingForm.controls.checkindate.value,
      check_out_date: this.bookingForm.controls.checkoutdate.value,
      hotel: this.bookingForm.controls.hotelName.value,
      number_guests: this.bookingForm.controls.guests.value,
      room_type: this.bookingForm.controls.room.value,
    };

  
    this.booking.AddBooking(payload).subscribe({
      next: (res) => {
        this.successMessage = "Booking Confirmed !!!!";
        alert("Booking Confirmed !!!");
        console.log(res);
        this.closeModal();
        this.bookingForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        if (err.status === 401) {
          alert("Session expired  Please login again");
          this.authService.removeToken();
          this.router.navigate(['/user-login']);
        } else {
          alert(err.error?.detail || "Booking failed ");
        }
      }
    });
  }

  hotelNames: string[] = [
    'Urban Palace',
    'The Heritage',
    'Grand Palace',
    'Hotel Sunrise',
    'Ocean View Resort',
    'Mountain Nest',
    'City Light Hotel',
    'Hotel Green Park',
    'Royal Stay'
  ];
  filteredHotels: string[] = [...this.hotelNames];

  filterHotels() {
    const term = this.bookingForm.get('hotelName')?.value?.toLowerCase() || '';
    this.filteredHotels = this.hotelNames.filter(hotel =>
      hotel.toLowerCase().includes(term)
    );
  }

  clearData() {
    this.bookingForm.reset();
    this.submitted = false;
    this.successMessage = null;
  }

  closeModal() {
  const modalEl = document.getElementById('exampleModalCenter');
  if (modalEl) {
    const modalInstance = bootstrap.Modal.getInstance(modalEl)
      || new bootstrap.Modal(modalEl);
    modalInstance.hide();
  }
}
}


