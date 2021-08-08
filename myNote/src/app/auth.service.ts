import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth = false; // false

  login() {
    this.isAuth = true;
  }

  logout() {
    this.isAuth = false; // false
  }

  isAuthenticated(): Promise<boolean> {
    return Promise.resolve(this.isAuth);
  }
}
