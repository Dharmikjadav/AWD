import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-hotels',
  imports: [CommonModule,FormsModule],
  templateUrl: './hotels.html',
  styleUrl: './hotels.scss'
})
export class Hotels {
  searchTerm: string = '';
  selectedHotel: any = null;
  

  hotels = [
    { name: 'Urban Palace', location: 'Hyderabad', image: 'image/image7.jpg' },
    { name: 'The Heritage', location: 'Udaipur', image: 'image/image9.avif' },
    { name: 'Grand Palace', location: 'Chennai', image: 'image/image10.jpg' },
    { name: 'Hotel Sunrise', location: 'Mumbai, Maharashtra', image: 'image/hotel1.jpg' },
    { name: 'Ocean View Resort', location: 'Goa', image: 'image/home1.jpg' },
    { name: 'Mountain Nest', location: 'Manali, Himachal', image: 'image/image3.jpg' },
    { name: 'City Light Hotel', location: 'Ahmedabad, Gujarat', image: 'image/image4.jpg' },
    { name: 'Hotel Green Park', location: 'Pune', image: 'image/image5.avif' },
    { name: 'Royal Stay', location: 'Delhi', image: 'image/image6.jpg' },
    
  ];

  get filteredHotels() {
    return this.hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  openModal(hotel: any) {
  this.selectedHotel = hotel;

  const modalEl = document.getElementById('hotelDetailModal');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}
}
