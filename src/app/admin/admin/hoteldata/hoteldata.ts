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
  hotels: any[] = [];
  isloading = true;
  editmode = false;

  selectedFile: File | null = null;
  imagePreviewUrl: string = '';
  private allowedTypes = ['image/jpeg', 'image/png'];
  private maxFileSizeBytes = 5 * 1024 * 1024;

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
    const file = event.target.files?.[0];

    if (!file) return;

    if (!this.allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Only JPG and PNG images are allowed.'
      });
      this.resetFileSelection(event);
      return;
    }

    if (file.size > this.maxFileSizeBytes) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Max file size is 5 MB.'
      });
      this.resetFileSelection(event);
      return;
    }

    this.selectedFile = file;
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
    this.imagePreviewUrl = URL.createObjectURL(file);
  }

  private resetFileSelection(event?: any) {
    this.selectedFile = null;
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
    this.imagePreviewUrl = '';
    if (event?.target) {
      event.target.value = '';
    }
  }

  ngOnInit() {
    this.addhotel = this.fb.group({
      hotel_name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required]],
      amenities: ['', [Validators.required]]
    });
    this.gethotels();

  }

  openAddModal() {
    this.editmode = false;
    this.selectedHotel = null;
    this.resetFileSelection();
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

    if (!this.selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'Image Required',
        text: 'Please select an image to upload.'
      });
      return;
    }

    const formvalue = this.addhotel.value;

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('hotel_name', formvalue.hotel_name);
    formData.append('location', formvalue.location);
    formData.append('amenities', JSON.stringify(
      formvalue.amenities
        ? formvalue.amenities.split(',').map((a: string) => a.trim())
        : []
    ));

    this.hotleservice.addhotel(formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Hotel Added',
          text: 'Hotel added successfully'
        });
        this.addhotel.reset();
        this.resetFileSelection();
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
        image_src: this.hotleservice.resolveImageUrl(hotel.image_url)
      }));
      this.isloading = false;
    });
  }

  editHotel(hotel: any) {
    debugger;
    this.editmode = true;
    this.selectedHotel = hotel;
    this.resetFileSelection();
    console.log(this.selectedHotel);
    this.addhotel.patchValue({
      hotel_name: this.selectedHotel.hotel_name,
      location: this.selectedHotel.location,
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

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.selectedHotel?.image_url) {
      formData.append('image_url', this.selectedHotel.image_url);
    }
    formData.append('hotel_name', formvalue.hotel_name);
    formData.append('location', formvalue.location);
    formData.append('amenities', JSON.stringify(
      formvalue.amenities
        ? formvalue.amenities.split(',').map((a: string) => a.trim())
        : []
    ));

    this.hotleservice.updatehotel(this.selectedHotel._id, formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Hotel Updated',
          text: 'Hotel updated successfully'
        });
        console.log(res);
        this.addhotel.reset();
        this.resetFileSelection();
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
