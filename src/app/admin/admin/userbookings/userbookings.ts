import { Component } from '@angular/core';
import { Booking } from '../../../service/booking';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userbookings',
  imports: [CommonModule],
  templateUrl: './userbookings.html',
  styleUrl: './userbookings.scss'
})
export class Userbookings {

  bookings: any[] = [];


  constructor(private bookingService: Booking) { }

  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        this.bookings = data.hotels || [];
        console.log("Bookings loaded:", this.bookings);
      },
      error: (err) => {
        console.error("Failed to load bookings:", err);
      }
    });
  }

  deleteBooking(booking: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingService.deleteBookings(booking._id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Booking has been deleted.',
              'success'
            );
            this.loadBookings();
          }
        });
      }
    });
  }

  updateStatus(id: string, status: string) {
    this.bookingService.updateBookingStatus(id, status).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Booking ${status} successfully.`,
          timer: 1500,
          showConfirmButton: false
        });
        this.loadBookings();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Failed to update booking status.'
        });
      }
    });
  }
  ngOnInit() {
    this.loadBookings();
  }
}
