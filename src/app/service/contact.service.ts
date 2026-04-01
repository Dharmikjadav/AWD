import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getContacts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-contacts`);
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-contact/${id}`);
  }
}

