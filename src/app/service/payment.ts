import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = environment.apiUrl;  // your FastAPI URL

  constructor(private http: HttpClient) {}

  createOrder(amount: number) {
    return this.http.post<any>(`${this.apiUrl}/create-order`, { amount });
  }

  verifyPayment(data: any) {
    return this.http.post(`${this.apiUrl}/verify-payment`, data);
  }
}