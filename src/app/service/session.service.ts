import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../models/session';

const ApiUrl = "http://10.179.17.67:8080/bvsc-mapp/api/v1/session";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http:HttpClient) { }
  create(data:any):Observable<Session>{
    return this.http.post<Session>(`${ApiUrl}`,data)
  }
  update(id:string,data:any):Observable<Session>{
    return this.http.put<Session>(`${ApiUrl}/${id}`,data)
  }
}
