import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/auth';
import * as MobileDetect from 'mobile-detect';

const apiUrl = 'http://10.179.17.67:8080/bvsc-mapp/api/v1/auth/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private md: MobileDetect;
  constructor(private http:HttpClient) {
    this.md = new MobileDetect(window.navigator.userAgent);
  }
  
  isMobile(): boolean {
    return !!this.md.mobile();
  }

  isTablet(): boolean {
    return !!this.md.tablet();
  }

  isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet();
  }

  
  Login(data:any):Observable<User>{
    return this.http.post<User>(apiUrl,data).pipe(
      tap((response: any) => {
        localStorage.setItem('id', response.id);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('exp', response.exp);
        localStorage.setItem('roles', response.roles);
      })
    );;
  }


}
