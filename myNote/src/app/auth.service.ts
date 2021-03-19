import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth = true; // false

  login() {
    this.isAuth = true;
  }

  logout() {
    this.isAuth = true; // false
  }

  isAuthenticated(): Promise<boolean> {
    return Promise.resolve(this.isAuth);
  }
}
