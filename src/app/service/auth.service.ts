import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8001/api';

  private loggedIn = new BehaviorSubject<boolean>(!!this.getToken());
  loggedIn$ = this.loggedIn.asObservable();

  private userSubject = new Subject<any>();
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  setToken(token: string) {
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    this.loggedIn.next(false);
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  isAdmin(): boolean {
    const email = localStorage.getItem('email');
    return email === 'admin@gmail.com';
  }

  checkSession(): Observable<any> {
    const token = this.getToken();
    if (!token) return throwError(() => new Error("No token found"));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/check-session`, { headers })
      .pipe(
        tap((res: any) => {
          if (res.user) {
            this.userSubject.next(res.user);
          }
        }),
        catchError(err => throwError(() => err))
      );
  }

  logout(): Observable<any> {
    this.removeToken();
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
