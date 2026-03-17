import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Packagesservice {
  private apiUrl = environment.apiUrl;
   constructor(private http: HttpClient, private authService: AuthService) {}

    getPackages() {
        return this.http.get(`${this.apiUrl}/get-packages`);
    }

    addPackage(data: any) {
        return this.http.post(`${this.apiUrl}/add-packages`, data);
    }

    deletePackage(id: string) {
        return this.http.delete(`${this.apiUrl}/deletepackage/${id}`);
    }

    updatePackage(id: string, data: any) {
        return this.http.put(`${this.apiUrl}/update-package/${id}`, data);
    }
}
