import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import Swal from 'sweetalert2';

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
         Swal.fire({
          icon: 'success',
          title: 'Logout successful',
        });
        this.router.navigate(['/user-login']);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Logout failed',
        });
        this.router.navigate(['/user-login']);
      }
    });
  }

  closeNavbar() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu?.classList.contains('show')) {
      const bsCollapse = new (window as any).bootstrap.Collapse(navMenu, {
        toggle: false
      });
      bsCollapse.hide();
    }
  }
}
