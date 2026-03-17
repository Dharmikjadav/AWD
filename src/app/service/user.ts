import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
  private apiUrl = environment.apiUrl;
  public currusers = new BehaviorSubject<number>(0);
  usercount$ = this.currusers.asObservable();
  constructor(private http: HttpClient, private authService: AuthService) { }

  setUserCount(count: number) {
    this.currusers.next(count);
  }

  getUsers() {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }

  updateusers(id: string, data: any) {
    return this.http.put(
      `${this.apiUrl}/updateuser/${id}`, data
    );  
  }

  deleteusers(id: string) {
    return this.http.delete(`${this.apiUrl}/deleteuser/${id}`);
  }

}
