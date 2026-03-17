import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../service/user';
import { AuthService } from '../../../service/auth.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile {
  editForm!: FormGroup;
  selectedId: string = '';
  editmode = false;
  userslist: any[] = [];

  constructor(
    private users: User,
    private fb: FormBuilder,
    private auth: AuthService
  ) { }


  ngOnInit() {

    this.editForm = this.fb.group({
      fullname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z ]+$')
        ]
      ],
      email: ['', [Validators.required, Validators.email]],

      phone: [
        '',
        [Validators.required,Validators.pattern('^[0-9]{10}$')]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      confirmPassword: ['', Validators.required]
    });
    // load currently authenticated user from DB (match by stored email)


    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      // 1. Load User Details
      this.users.getUsers().subscribe((data: any) => {
        const list = data?.users || data || [];
        const found = list.find((u: any) => u.email === storedEmail);
        if (found) {
          this.selectedId = found._id || found.id || '';
          this.editForm.patchValue({
            fullname: found.fullname || '',
            email: found.email || '',
            phone: found.phone || '',
            password: found.password || '',
            confirmPassword: found.confirmPassword || ''
          });
        }
      });
    }
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

  updateUser() {
    debugger;
    const formData = this.editForm.value;
    console.log(formData);
    this.users.updateusers(this.selectedId, formData)
      .subscribe((res) => {
        Swal.fire({
          icon: 'success',
          title: 'User Updated',
          text: 'User details updated successfully'
        });
      });
  }

  chekuser() {
    this.users.getUsers().subscribe((data: any) => {
      this.userslist = data.users;
      console.log(data);
    });
  }
}
