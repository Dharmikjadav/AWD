import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Booking {

  private apiUrl = environment; 

  constructor(public http : HttpClient){}

  AddBooking(request : any){
    return this.http.post<any>(`${this.apiUrl}/add-booking`, request);
  }
  
}
