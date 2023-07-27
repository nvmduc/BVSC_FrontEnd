import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Election } from '../models/election';

const ApiUrl = "http://10.179.17.67:8080/bvsc-mapp/api/v1/election";

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  constructor(private http:HttpClient) { }
  getAll():Observable<Election>{
    return this.http.get<Election>(`${ApiUrl}/all`);
  }

  getById(id:string):Observable<Election>{
    return this.http.get<Election>(`${ApiUrl}/${id}`)
  }
  getByIdMeeting(idMeeting:number):Observable<Election>{
    return this.http.get<Election>(`${ApiUrl}/allByMeeting/${idMeeting}`)
  }
  delete(id:any):Observable<Election>{
    return this.http.delete<Election>(`${ApiUrl}/${id}`)
  }
  create(data:any):Observable<Election>{
    return this.http.post<Election>(`${ApiUrl}`,data)
  }
  update(id:string,data:any):Observable<Election>{
    return this.http.put<Election>(`${ApiUrl}/${id}`,data)
  }
}
