import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbaradmin',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbaradmin.html',
  styleUrl: './navbaradmin.scss'
})
export class Navbaradmin {

  constructor(private authService: AuthService, private router: Router) { };
  logout() {
    this.authService.logout().subscribe({
      next: () => {

        this.router.navigate(['/user-login']);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'There was an error during logout.'
        });
        this.router.navigate(['/user-login']);
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const navbar = document.querySelector('.navbar');

    if (window.scrollY > 50) {
      navbar?.classList.add('navbar-small');
    } else {
      navbar?.classList.remove('navbar-small');
    }
  }

  closeNavbar() {
    const navMenu = document.getElementById('adminNavMenu');
    if (navMenu?.classList.contains('show')) {
      const bsCollapse = new (window as any).bootstrap.Collapse(navMenu, {
        toggle: false
      });
      bsCollapse.hide();
    }
  }
}
