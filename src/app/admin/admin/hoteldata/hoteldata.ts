import { Component } from '@angular/core';
import { User } from '../../../service/user';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Hotelsdata } from '../../../service/hotelsdata';
import Swal from 'sweetalert2';
// import { Hotels } from '../../../components/core-component/hotels/hotels';
declare var bootstrap: any;
@Component({
  selector: 'app-hoteldata',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './hoteldata.html',
  styleUrl: './hoteldata.scss'
})
export class Hoteldata {
  searchTerm: string = '';
  selectedHotel: any = null;
  addhotel!: FormGroup;
  // editform!: FormGroup;
  hotels: any[] = [];
  base64Image: string = '';
  isloading = true;
  editmode = false;
  constructor(private hotleservice: Hotelsdata, private fb: FormBuilder) { }


  get filteredHotels() {
    return this.hotels.filter(hotel =>
      hotel.hotel_name?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  trackByHotel(index: number, hotel: any) {
    return hotel._id || index;
  }

  openModal(hotel: any) {
    this.selectedHotel = hotel;

    const modalEl = document.getElementById('hotelDetailModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.base64Image = reader.result as string;
        console.log(this.base64Image);
      };

      reader.readAsDataURL(file);
    }
  }




  ngOnInit() {
    this.addhotel = this.fb.group({
      // image_url: ['', [Validators.required]],
      hotel_name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required]],
      // price_per_night: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      amenities: ['', [Validators.required]]
    });
    this.gethotels();

  }

  openAddModal() {
    this.editmode = false;
    this.selectedHotel = null;
    this.base64Image = '';
    this.addhotel.reset();

    // show bootstrap modal programmatically instead of relying on attributes
    const modalEl = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  hideAddModal() {
    const modalEl = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  }

  addhotels() {

    if (this.addhotel.invalid) {
      this.addhotel.markAllAsTouched();

      Swal.fire({
        icon: 'error',
        title: 'Form Error',
        text: 'Please fill all required fields'
      });

      return;
    }

    const formvalue = this.addhotel.value;

    const payload = {
      image_url: this.base64Image,
      hotel_name: formvalue.hotel_name,
      location: formvalue.location,
      amenities: formvalue.amenities
        ? formvalue.amenities.split(',').map((a: string) => a.trim())
        : []
    };

    this.hotleservice.addhotel(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Hotel Added',
          text: 'Hotel added successfully'
        });
        this.addhotel.reset();
        this.hideAddModal();
        this.gethotels();
      }
    });
  }
  gethotels() {
    this.isloading = true;
    this.hotleservice.gethotels().subscribe((data: any) => {
      this.hotels = data.hotels.map((hotel: any) => ({
        ...hotel,
        image_url: hotel.image_url.startsWith('data')
          ? hotel.image_url
          : 'data:image/jpeg;base64,' + hotel.image_url
      }));
      this.isloading = false;
    });
  }

  editHotel(hotel: any) {
    debugger;
    this.editmode = true;
    this.selectedHotel = hotel;
    this.base64Image = hotel.image_url;
    console.log(this.selectedHotel);
    this.addhotel.patchValue({
      // image_url: this.selectedHotel.image_url,
      hotel_name: this.selectedHotel.hotel_name,
      location: this.selectedHotel.location,
      // price_per_night: this.selectedHotel.price_per_night,
      amenities: this.selectedHotel.amenities?.join(', ') || ''
    });

    const modalEl = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  updateHotel() {
    if (this.addhotel.invalid) {
      this.addhotel.markAllAsTouched();
      return;
    }
    const formvalue = this.addhotel.value;
    console.log(formvalue);
    const payload = {
      image_url: this.base64Image || this.selectedHotel.image_url,
      hotel_name: formvalue.hotel_name,
      location: formvalue.location,
      // price_per_night: Number(formvalue.price_per_night),
      amenities: formvalue.amenities
        ? formvalue.amenities.split(',').map((a: string) => a.trim())
        : []
    };

    this.hotleservice.updatehotel(this.selectedHotel._id, payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Hotel Updated',
          text: 'Hotel updated successfully'
        });
        console.log(res);
        this.addhotel.reset();
        this.hideAddModal();
        this.gethotels();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Hotel Update Failed',
          text: err.error?.detail || "Failed to update hotel"
        });
      }
    });
  }

  deleteHotel(hotel: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this hotel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hotleservice.deletehotel(hotel._id).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Hotel Deleted',
              text: 'Hotel deleted successfully'
            });
            this.gethotels();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Hotel Delete Failed',
              text: err.error?.detail || "Failed to delete hotel"
            });
          }
        });
      }
    }
    );
  }
}
// function viewchild(arg0: string): (target: Hoteldata, propertyKey: "closeModal") => void {
//   throw new Error('Function not implemented.');
// }


