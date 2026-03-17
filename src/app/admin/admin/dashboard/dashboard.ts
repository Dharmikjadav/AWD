import { Component, OnInit } from '@angular/core';
import { Booking } from '../../../service/booking';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { User } from '../../../service/user';
import { Hotelsdata } from '../../../service/hotelsdata';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {


  totalUsers: number = 0;
  totalHotels: number = 0;
  totalBookings: number = 0;
  revenue: number = 0;
  pendingbooking: number = 0;
  isUsersLoading = true;
  isHotelsLoading = true;
  isbookingsLoading = true;
  isRevenueLoading = true;
  recentBookings: any[] = [];
  isRecentBookingsLoading = true;

  constructor(private users: User, private hotels: Hotelsdata, private booking: Booking) { }


  usercount() {
    this.isUsersLoading = true;
    this.users.getUsers().subscribe((data: any) => {
      console.log(data);
      this.totalUsers = data.users.length;
      this.isUsersLoading = false;
    });
  }

  hotelcount() {
    this.isHotelsLoading = true;
    this.hotels.gethotels().subscribe((data: any) => {
      console.log(data);
      this.totalHotels = data.hotels.length;
      this.isHotelsLoading = false;
    });
  }

  bookingcount() {
    this.isbookingsLoading = true;
    this.booking.getBookings().subscribe((data1: any) => {
      console.log(data1);
      data1.hotels.forEach((value : any) => {
        console.log(value);
        if (value.status === 'Approved') {
          this.totalBookings += 1;
        }
        else if(value.status === 'Pending') {
          this.pendingbooking += 1;
        }
      });
      this.isbookingsLoading = false;
    });
  }


  revenuecount() {
    this.isRevenueLoading = true;
    this.booking.getBookings().subscribe((data: any) => {
      console.log(data);
      this.revenue = data.hotels.reduce((total: number, booking: any) => {
        if (booking.status === 'Approved') {
          return total + (booking.package_price || 0);
        }
        return total;
      }, 0);
      this.isRevenueLoading = false;
    });
  }

  getRecentBookings() {
    this.isRecentBookingsLoading = true;
    this.booking.getBookings().subscribe((data: any) => {
      // Get last 5 bookings
      this.recentBookings = data.hotels ? data.hotels.slice(0, 5) : [];
      this.isRecentBookingsLoading = false;
    }, (error) => {
      console.error('Error fetching recent bookings:', error);
      this.isRecentBookingsLoading = false;
    });
  }

  ngOnInit(): void {
    this.hotelcount();
    this.usercount();
    this.bookingcount();
    this.getRecentBookings();
    this.revenuecount();
  }

}
