import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../service/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss'
})
export class Contacts implements OnInit {

  contacts: any[] = [];
  loading: boolean = true;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    this.loading = true;
    this.contactService.getContacts().subscribe({
      next: (data: any) => {
        console.log(data);
        this.contacts = data.contacts || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load contacts', err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load contact messages'
        });
      }
    });
  }

  deleteContact(contact: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the message from "${contact.fname}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(contact._id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Contact message has been deleted.',
              'success'
            );
            this.getContacts();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete contact message'
            });
          }
        });
      }
    });
  }
}

