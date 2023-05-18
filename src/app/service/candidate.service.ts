import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Candidate } from '../models/candidate';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/candidate";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  constructor(private http:HttpClient) { }
  getAll():Observable<Candidate>{
    return this.http.get<Candidate>(`${ApiUrl}/all`);
  }

  getById(id:string):Observable<Candidate>{
    return this.http.get<Candidate>(`${ApiUrl}/${id}`).pipe(tap(s=> console.log(id)))
  }
  getByIdElection(idElection:string):Observable<Candidate>{
    return this.http.get<Candidate>(`${ApiUrl}/allByElection/${idElection}`)
  }
  delete(id:any):Observable<Candidate>{
    return this.http.delete<Candidate>(`${ApiUrl}/${id}`).pipe(
      tap(() => console.log(id))
    )
  }
  create(data:any):Observable<Candidate>{
    return this.http.post<Candidate>(`${ApiUrl}`,data).pipe(
      tap(_s=>console.log("post"))
    )
  }
  update(id:string,data:any):Observable<Candidate>{
    return this.http.put<Candidate>(`${ApiUrl}/${id}`,data).pipe(
      tap(_s=>console.log(id))
    )
  }
}
