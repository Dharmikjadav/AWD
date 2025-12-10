import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  showPopup = false;
  username: string = "";

  constructor(public authService: AuthService, private router: Router) { }
  ngOnInit() {
    this.authService.checkSession().subscribe({
      next: () => { },
      error: () => {
        this.username = "";
      }
    });

    this.authService.user$.subscribe(user => {
      this.username = user?.fullname || "";
    });
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }


  logout() {
    this.authService.logout().subscribe({
      next: () => {
        alert('You are now logged out. Thank you for using our service. ');
        this.router.navigate(['/user-login']);
      },
      error: () => {
        alert('Logout failed ');
        this.router.navigate(['/user-login']);
      }
    });
  }


}
