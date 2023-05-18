import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Shareholder } from '../models/shareholder';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/shareholder";

@Injectable({
  providedIn: 'root'
})
export class ShareholderInfoService {

  constructor(private http:HttpClient) { }
  getAll():Observable<Shareholder>{
    return this.http.get<Shareholder>(`${ApiUrl}/all`);
  }

  getById(id:string):Observable<Shareholder>{
    return this.http.get<Shareholder>(`${ApiUrl}/${id}`).pipe(tap(s=> console.log(id)))
  }
  getByIdMeeting(id:number):Observable<Shareholder>{
    return this.http.get<Shareholder>(`${ApiUrl}/allByMeeting/${id}`).pipe(tap(s=> console.log(id)))
  }
  delete(id:any):Observable<Shareholder>{
    return this.http.delete<Shareholder>(`${ApiUrl}/${id}`).pipe(
      tap(() => console.log(id))
    )
  }
  create(data:any):Observable<Shareholder>{
    return this.http.post<Shareholder>(`${ApiUrl}`,data).pipe(
      tap(_s=>console.log("post"))
    )
  }
  update(id:string,data:any):Observable<Shareholder>{
    return this.http.put<Shareholder>(`${ApiUrl}/${id}`,data).pipe(
      tap(_s=>console.log(data))
    )
  }
}
