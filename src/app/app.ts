import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Navbar } from "./components/core-component/navbar/navbar";
import { Footer } from "./components/core-component/footer/footer";
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('AWD_PROJECT');

  constructor(public authservice : AuthService){}
}
