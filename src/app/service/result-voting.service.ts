import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultVoting } from '../models/result-voting';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/result";

@Injectable({
  providedIn: 'root'
})
export class ResultVotingService {
  constructor(private http:HttpClient) { }
  getAll():Observable<ResultVoting>{
    return this.http.get<ResultVoting>(`${ApiUrl}/all-result-voting`);
  }
  getByIdShareholer(idShareholder:string):Observable<ResultVoting>{
    return this.http.get<ResultVoting>(`${ApiUrl}/get-result-voting-by-shareholder/${idShareholder}`)
  }
  getByIdMeeting(idMeeting:number):Observable<ResultVoting>{
    return this.http.get<ResultVoting>(`${ApiUrl}/get-result-voting-by-meeting/${idMeeting}`)
  }
  create(data:any):Observable<ResultVoting>{
    return this.http.post<ResultVoting>(`${ApiUrl}/save-voting`,data)
  }
  update(id:number,data:any):Observable<ResultVoting>{
    return this.http.put<ResultVoting>(`${ApiUrl}/voting/edit/${id}`,data)
  }
}
