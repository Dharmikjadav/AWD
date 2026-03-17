import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Booking } from '../../../service/booking';
import { AuthService } from '../../../service/auth.service';

@Component({
    selector: 'app-my-bookings',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './my-bookings.html',
    styleUrls: ['./my-bookings.scss']
})
export class MyBookings implements OnInit {
    myBookings: any[] = [];
    isLoading = true;

    constructor(
        private bookingService: Booking,
        private auth: AuthService
    ) { }

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings(): void {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
            this.isLoading = false;
            return;
        }

        this.bookingService.getBookings().subscribe({
            next: (data: any) => {
                // The backend returns { "hotels": [...] } for bookings
                const allBookings = data?.hotels || data?.bookings || (Array.isArray(data) ? data : []);
                // Filter bookings where the email matches the logged-in user
                this.myBookings = allBookings.filter((b: any) =>
                    b.email === storedEmail ||
                    b.user_email === storedEmail ||
                    b.useremail === storedEmail
                );
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error fetching bookings:', err);
                this.isLoading = false;
            }
        });
    }
}
