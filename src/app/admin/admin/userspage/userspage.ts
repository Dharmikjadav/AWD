import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../service/user';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userspage',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './userspage.html',
  styleUrl: './userspage.scss'
})
export class Userspage {
  users: any[] = [];
  editForm!: FormGroup;
  selectedId: string = '';
  editmode = false;
  index: number = 0;

  constructor(private userService: User, private fb: FormBuilder) { }

  ngOnInit() {
    this.getUsers();

    this.editForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: [''],
      confirmPassword: ['']
    });
  }



  getUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data.users;
      console.log(data);
    });
  }

  editUser(user: any) {
    this.editmode = true;
    this.selectedId = user._id;
    console.log(this.selectedId);
    this.editForm.patchValue({
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      password: user.password,
      confirmPassword: ''
    });
  }
  closePopup() {
    this.editmode = false;
  }
  // Update API
  updateUser() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const formData = this.editForm.value;
    console.log(formData);
    this.userService.updateusers(this.selectedId, formData)
      .subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'User Updated',
          text: 'User details have been updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        this.getUsers();

        const modalEl = document.getElementById('exampleModal');
        const modalInstance = new (window as any).bootstrap.Modal(modalEl);
        modalInstance.hide();

        this.editmode = false;
      });
  }

  deleteUser(user: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete user ${user.fullname}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteusers(user._id).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          );
          this.getUsers();
        });
      }
    });
  }}
