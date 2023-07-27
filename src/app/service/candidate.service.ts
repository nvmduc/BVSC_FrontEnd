import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Candidate } from '../models/candidate';

const ApiUrl = "http://10.179.17.67:8080/bvsc-mapp/api/v1/candidate";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  constructor(private http:HttpClient) { }
  getAll():Observable<Candidate>{
    return this.http.get<Candidate>(`${ApiUrl}/all`);
  }

  getById(id:number):Observable<Candidate>{
    return this.http.get<Candidate>(`${ApiUrl}/${id}`)
  }
  getByIdElection(idElection:string):Observable<Candidate>{
    return this.http.get<Candidate>(`${ApiUrl}/allByElection/${idElection}`)
  }
  getByIdMeeting(idMeeting:number):Observable<Candidate>{
    return this.http.get<Candidate>(`${ApiUrl}/get-candidate-by-meeting/${idMeeting}`)
  }
  delete(id:any):Observable<Candidate>{
    return this.http.delete<Candidate>(`${ApiUrl}/${id}`)
  }
  deleteByIdElection(id:any):Observable<Candidate>{
    return this.http.delete<Candidate>(`${ApiUrl}/delete-by-id-election/${id}`)
  }
  create(data:any):Observable<Candidate>{
    return this.http.post<Candidate>(`${ApiUrl}`,data)
  }
  update(id:string,data:any):Observable<Candidate>{
    return this.http.put<Candidate>(`${ApiUrl}/${id}`,data)
  }
}
