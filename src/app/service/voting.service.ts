import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Voting } from '../models/voting';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/voting";

@Injectable({
  providedIn: 'root'
})
export class VotingService {
  constructor(private http:HttpClient) { }
  getAll():Observable<Voting>{
    return this.http.get<Voting>(`${ApiUrl}/all`);
  }

  getById(id:string):Observable<Voting>{
    return this.http.get<Voting>(`${ApiUrl}/${id}`).pipe(tap(s=> console.log(id)))
  }
  getByIdMeeting(idMeeting:number):Observable<Voting>{
    return this.http.get<Voting>(`${ApiUrl}/allByMeeting/${idMeeting}`)
  }
  delete(id:any):Observable<Voting>{
    return this.http.delete<Voting>(`${ApiUrl}/${id}`).pipe(
      tap(() => console.log(id))
    )
  }
  create(data:any):Observable<Voting>{
    return this.http.post<Voting>(`${ApiUrl}`,data).pipe(
      tap(_s=>console.log("post"))
    )
  }
  update(id:string,data:any):Observable<Voting>{
    return this.http.put<Voting>(`${ApiUrl}/${id}`,data).pipe(
      tap(_s=>console.log(id))
    )
  }
}
