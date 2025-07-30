import { Component } from '@angular/core';
import { Dashboard } from "../dashboard/dashboard";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Registration } from "../registration/registration";

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
 showPopup = false;

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
