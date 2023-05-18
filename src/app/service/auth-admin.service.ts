import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserAdmin } from '../models/admin-auth';

const apiUrl = 'http://localhost:8080/bvsc-mapp/api/v1/auth/admin/login';

@Injectable({
  providedIn: 'root'
})

export class AuthAdminService {

  constructor(private http:HttpClient) { }

  Login(data:any):Observable<UserAdmin>{
    return this.http.post<UserAdmin>(apiUrl,data).pipe(
      tap((response: any) => {
        localStorage.setItem('id', response.id);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('exp', response.exp);
        localStorage.setItem('idCompany', response.idCompany);
      })
    );;
  }

}
