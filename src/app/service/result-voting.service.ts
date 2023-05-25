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

  // getById(id:string):Observable<ResultVoting>{
  //   return this.http.get<ResultVoting>(`${ApiUrl}/${id}`)
  // }
  getByIdShareholer(idShareholder:string):Observable<ResultVoting>{
    return this.http.get<ResultVoting>(`${ApiUrl}/get-result-voting-by-shareholder/${idShareholder}`)
  }
  // delete(id:any):Observable<ResultVoting>{
  //   return this.http.delete<ResultVoting>(`${ApiUrl}/${id}`)
  // }
  create(data:any):Observable<ResultVoting>{
    return this.http.post<ResultVoting>(`${ApiUrl}/save-voting`,data)
  }
  update(id:string,data:any):Observable<ResultVoting>{
    return this.http.put<ResultVoting>(`${ApiUrl}/${id}`,data)
  }
}
