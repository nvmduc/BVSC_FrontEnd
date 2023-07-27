import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserAdmin } from '../models/admin-auth';

const apiUrl = 'http://10.179.17.67:8080/bvsc-mapp/api/v1/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthAdminService {

  constructor(private http:HttpClient) { }

  Login(data:any):Observable<UserAdmin>{
    return this.http.post<UserAdmin>(`${apiUrl}/admin/login`,data).pipe(
      tap((response: any) => {
        localStorage.setItem('id', response.id);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('exp', response.exp);
        localStorage.setItem('role', response.role);
      })
    );;
  }
  getAll():Observable<UserAdmin>{
    return this.http.get<UserAdmin>(`${apiUrl}/all`);
  }
  CreatePreside(data:any):Observable<UserAdmin>{
    return this.http.post<UserAdmin>(`${apiUrl}/create`,data);
  }
}
