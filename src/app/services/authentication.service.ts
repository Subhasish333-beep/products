import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    private apiUrl = "http://localhost:8081";
    private http = inject(HttpClient);

    getUser(user:any) {
      return this.http.post(this.apiUrl+"/login", user)
    }

    registerUser(user:any) {
      return this.http.post(this.apiUrl+"/signup", user)
    }

    getCurrentUser(): User | null {
      let userData = localStorage.getItem("userData") ?? "{}"
      let parsedUser = JSON.parse(userData);
      return parsedUser;
    }

    isAuthenticated(): boolean {
      return !!this.getCurrentUser();
    }
}
