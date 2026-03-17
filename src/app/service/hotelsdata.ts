import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Hotelsdata{
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  addhotel(data: any) {
    return this.http.post(`${this.apiUrl}/add-hotel`, data);
  }

  gethotels() {
    return this.http.get<any>(`${this.apiUrl}/get-hotels`);
  }

  deletehotel(id: string) {
    return this.http.delete(`${this.apiUrl}/deletehotel/${id}`);
  }

  updatehotel(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/updatehotel/${id}`, data);
  }

  gethotels1() {
  return this.http.get<{ id: number; hotel_name: string }[]>(
    `${this.apiUrl}/get-hotels`
  );
}
}