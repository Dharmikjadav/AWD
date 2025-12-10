import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class Booking {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  AddBooking(request: any) {
    const token = this.authService.getToken();
    if (!token) throw new Error('User not authenticated');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/add-booking`, request, { headers });
  }

  contect(request : any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/contact`,request,{headers});
  }
}
