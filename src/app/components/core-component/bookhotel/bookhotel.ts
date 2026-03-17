import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Booking } from '../../../service/booking';
import { Hotelsdata } from '../../../service/hotelsdata';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../service/payment';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare var Razorpay: any;
@Component({
  selector: 'app-bookhotel',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bookhotel.html',
  styleUrl: './bookhotel.scss'
})
export class Bookhotel {
  submitted = false;
  successMessage: string | null = null;
  hotels: any[] = [];
  selectedPackageAmount: number = 0;
  selectedPackageName: string = '';
  selectedHotelName: string = '';
  selectedPackageDuration: number = 0;
  todayDatetime!: string;


  bookingForm = new FormGroup({
    fullname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    checkindate: new FormControl(''),
    checkoutdate: new FormControl(''),
    guests: new FormControl(''),
    package_name: new FormControl(''),
    hotel: new FormControl('')
  });

  constructor(
    private fb: FormBuilder,
    public booking: Booking,
    private hotelService: Hotelsdata,
    private authService: AuthService,
    private router: Router,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.bookingForm = this.fb.group(
      {
        fullname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z ]+$')]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
        checkindate: ['', Validators.required],
        checkoutdate: ['', Validators.required],
        guests: ['', Validators.required],
        hotel: ['', Validators.required],
        package_name: ['', Validators.required]
      },
      { validators: this.checkOutAfterCheckIn }

    );
    this.loadHotels();
    debugger;
    const now = new Date();
    this.todayDatetime = now.toISOString().slice(0, 16);

    this.bookingForm.get('checkindate')?.valueChanges.subscribe(date => {
      this.calculateCheckout(date);
    });

    const modalEl = document.getElementById('exampleModalCenter');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.clearData();
      });
    }

    this.route.queryParams.subscribe(params => {
      debugger;
      this.selectedPackageAmount = +params['packageAmount'] || 0;
      this.selectedPackageName = params['packageName'] || '';
      this.selectedHotelName = params['hotelName'] || '';
      this.selectedPackageDuration = +params['packageDuration'] || 0;

      if (this.selectedHotelName) {
        this.bookingForm.patchValue({ hotel: this.selectedHotelName });
      }
      if (this.selectedPackageName) {
        this.bookingForm.patchValue({ package_name: this.selectedPackageName });
      }
      const checkin = this.bookingForm.get('checkindate')?.value;
      if (checkin) {
        this.calculateCheckout(checkin);
      }
    });

  }
  calculateCheckout(checkinDate: string | null) {

    if (!checkinDate || !this.selectedPackageDuration) return;

    const checkin = new Date(checkinDate);

    const checkout = new Date(checkin);
    checkout.setHours(checkin.getHours() + (this.selectedPackageDuration * 24));

    // Convert to local datetime-local format
    const year = checkout.getFullYear();
    const month = String(checkout.getMonth() + 1).padStart(2, '0');
    const day = String(checkout.getDate()).padStart(2, '0');
    const hours = String(checkout.getHours()).padStart(2, '0');
    const minutes = String(checkout.getMinutes()).padStart(2, '0');

    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;

    this.bookingForm.patchValue({
      checkoutdate: formatted
    });

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

  AddBooking() {
    debugger;
    this.submitted = true;

    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'You must login first to book a hotel.',
        confirmButtonColor: '#0b1d3a'
      }).then(() => {
        this.router.navigate(['/user-login']);
      });
      return;
    }

    if (this.bookingForm.invalid) {
      this.showValidationError();
      return;
    }

    const payload = {
      fname: this.bookingForm.controls.fullname.value,
      email: this.bookingForm.controls.email.value,
      phonenumber: this.bookingForm.controls.phone.value,
      check_in_date: this.bookingForm.controls.checkindate.value,
      check_out_date: this.bookingForm.controls.checkoutdate.value,
      hotel: this.bookingForm.controls.hotel.value,
      number_guests: this.bookingForm.controls.guests.value,
      package_name: this.bookingForm.controls.package_name.value,
      package_price: this.selectedPackageAmount
    };


    this.booking.AddBooking(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed!',
          text: `Your stay at ${this.bookingForm.controls.hotel.value} has been confirmed.`,
          confirmButtonColor: '#0b1d3a'
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
        this.bookingForm.reset();
        this.submitted = false;
      },

      error: (err) => {
        if (err.status === 401) {
          Swal.fire('Session Expired', 'Please login again.', 'error').then(() => {
            this.authService.removeToken();
            this.router.navigate(['/user-login']);
          });
        } else {
          Swal.fire('Booking Failed', err.error?.detail || "Something went wrong.", 'error');
        }
      }
    });
  }

  private showValidationError() {
    let errorMessage = "Please check all fields.";
    const controls = this.bookingForm.controls;

    if (controls.fullname.errors) errorMessage = "Please enter a valid name (min 3 letters).";
    else if (controls.email.errors) errorMessage = "Please enter a valid email address.";
    else if (controls.phone.errors) errorMessage = "Please enter a valid 10-digit Indian phone number.";
    else if (controls.checkindate.errors) errorMessage = "Check-in date is required.";
    else if (controls.checkoutdate.errors?.['required']) errorMessage = "Check-out date is required.";
    else if (controls.checkoutdate.errors?.['dateAfterCheckin']) errorMessage = "Check-out date must be after Check-in date.";
    else if (controls.guests.errors) errorMessage = "Please select number of guests.";
    else if (controls.hotel.errors) errorMessage = "Please select a hotel.";
    else if (controls.package_name.errors) errorMessage = "Please select a Package.";



    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: errorMessage,
      confirmButtonColor: '#0b1d3a'
    });
  }


  loadHotels() {
    this.hotelService.gethotels().subscribe((data: any) => {
      console.log("API Response:", data);

      this.hotels = data.hotels;   // store full objects

      console.log("Hotels:", this.hotels);
    });
  }

  // filterHotels() {
  //   const term = this.bookingForm.get('hotelName')?.value?.toLowerCase() || '';
  //   this.filteredHotels = this.hotelNames.filter(hotel =>
  //     hotel.toLowerCase().includes(term)
  //   );
  // }

  clearData() {
    this.bookingForm.reset();
    this.submitted = false;
    this.successMessage = null;
  }



  payNow() {

    this.submitted = true;

    if (!this.selectedPackageAmount) {
      Swal.fire({
        icon: 'error',
        title: 'Package Missing',
        text: 'Please select a package first.',
        confirmButtonColor: '#0b1d3a'
      });
      return;
    }

    if (this.bookingForm.invalid) {
      return;   // Angular will show errors under inputs
    }

    const hotelId = this.bookingForm.controls.hotel.value;
    const selectedHotel = this.hotels.find(h => h.id == hotelId || h.hotel_name == hotelId);
    this.selectedHotelName = selectedHotel?.hotel_name || hotelId || "Hotel";

    this.paymentService.createOrder(this.selectedPackageAmount).subscribe(order => {
      const options = {
        key: "rzp_test_SL8lBAFMnydVDl",
        amount: order.amount,
        currency: "INR",
        name: hotelId,
        description: "Room Booking Payment",
        order_id: order.id,
        handler: (response: any) => {

          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          };

          this.paymentService.verifyPayment(paymentData)
            .subscribe(res => {
              Swal.fire({
                icon: 'success',
                title: 'Payment Verified',
                text: 'Payment Successful & Verified ✅',
                confirmButtonColor: '#0b1d3a'
              }).then(() => {
                this.AddBooking(); // call booking after successful payment
              });
            });


        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    });
  }

}
