import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-registration',
  imports: [],
  templateUrl: './registration.html',
  styleUrl: './registration.scss'
})
export class Registration {
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}
