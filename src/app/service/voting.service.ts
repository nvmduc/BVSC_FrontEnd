import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Voting } from '../models/voting';

const ApiUrl = "http://10.179.17.67:8080/bvsc-mapp/api/v1/voting";

@Injectable({
  providedIn: 'root'
})
export class VotingService {
  constructor(private http:HttpClient) { }
  getAll():Observable<Voting>{
    return this.http.get<Voting>(`${ApiUrl}/all`);
  }

  getById(id:string):Observable<Voting>{
    return this.http.get<Voting>(`${ApiUrl}/${id}`)
  }
  getByIdMeeting(idMeeting:number):Observable<Voting>{
    return this.http.get<Voting>(`${ApiUrl}/allByMeeting/${idMeeting}`)
  }
  delete(id:any):Observable<Voting>{
    return this.http.delete<Voting>(`${ApiUrl}/${id}`)
  }
  create(data:any):Observable<Voting>{
    return this.http.post<Voting>(`${ApiUrl}`,data)
  }
  update(id:string,data:any):Observable<Voting>{
    return this.http.put<Voting>(`${ApiUrl}/${id}`,data)
  }
}
