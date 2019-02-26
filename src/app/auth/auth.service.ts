import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './signup/auth-date.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuth = false;
  private userId: string;
  private tokenTimer: any ;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuth;
  }

  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(result => {
        console.log(result);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuth = true;
      this.userId = authInformation.userId ;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  setAuthTimer(expiresIn: number) {
    console.log('Setting timer: ' + expiresIn) ;
    this.tokenTimer = setTimeout( () => {
      this.logout();
    }, expiresIn * 1000 ) ;
  }

  getUserId() {
    return this.userId ;
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    this.http
      .post<{ token: string, expiresIn: number, userId: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(result => {
        const token = result.token;
        const expiresIn = result.expiresIn ;
        this.token = token;
        if (token && expiresIn) {
          this.isAuth = true;
          this.authStatusListener.next(true);
          this.userId = result.userId;
          this.setAuthTimer(expiresIn );
          const now = new Date() ;
          const expDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(token, expDate, this.userId) ;
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next();
    this.clearAuthDate() ;
    clearTimeout( this.tokenTimer ) ;
    this.userId = null;
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token) ;
    localStorage.setItem('expirationDate', expirationDate.toISOString()) ;
    localStorage.setItem('userId', userId) ;
  }

  private clearAuthDate() {
    localStorage.removeItem('token') ;
    localStorage.removeItem('expirationDate') ;
    localStorage.removeItem('userId') ;
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expDate),
      userId: userId
    };
  }
}
