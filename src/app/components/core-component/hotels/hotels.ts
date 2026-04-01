import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Hotelsdata } from '../../../service/hotelsdata';
import { RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-hotels',
  imports: [CommonModule, FormsModule, RouterLink],

  templateUrl: './hotels.html',
  styleUrl: './hotels.scss'
})
export class Hotels {
  searchTerm: string = '';
  selectedHotel: any = null;
  hotels: any[] = [];
  isloading = true;
  mainImage: string = '';

  constructor(private hotelService: Hotelsdata) { }


  get filteredHotels() {
    const term = this.searchTerm.toLowerCase().trim();

    return this.hotels.filter(hotel =>
      hotel.hotel_name?.toLowerCase().includes(term) ||
      hotel.location?.toLowerCase().includes(term) ||
      hotel.amenities?.some((a: string) =>
        a.toLowerCase().includes(term)
      )
    );
  }
  openModal(hotel: any) {
    this.selectedHotel = hotel;

    const modalEl = document.getElementById('hotelDetailModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  setMainImage(img: string) {
    this.mainImage = img;
  }
  openHotelModal(hotel: any) {
    this.selectedHotel = hotel;
    this.mainImage = hotel.image_src;
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('bi-star-fill');
      } else if (rating >= i - 0.5) {
        stars.push('bi-star-half');
      } else {
        stars.push('bi-star');
      }
    }
    return stars;
  }

  gethotels() {
    this.isloading = true;
    this.hotelService.gethotels().subscribe((data: any) => {
      this.hotels = data.hotels.map((hotel: any) => ({
        ...hotel,
        rating: hotel.rating || (Math.floor(Math.random() * 2) + 4) + (Math.random() > 0.5 ? 0.5 : 0), // Mock rating if missing
        reviews_count: Math.floor(Math.random() * 100) + 20, // Mock review count
        image_src: this.hotelService.resolveImageUrl(hotel.image_url)
      }));
      this.isloading = false;
    });
  }

  ngOnInit() {
    this.gethotels();
  }
}
