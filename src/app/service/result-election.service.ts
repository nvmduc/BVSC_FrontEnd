import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultElection } from '../models/result-election';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/result";

@Injectable({
  providedIn: 'root'
})
export class ResultElectionService {

  constructor(private http:HttpClient) { }
  getAll():Observable<ResultElection>{
    return this.http.get<ResultElection>(`${ApiUrl}/all-result-election`);
  }

  // getById(id:string):Observable<ResultVoting>{
  //   return this.http.get<ResultVoting>(`${ApiUrl}/${id}`)
  // }
  getByIdShareholer(idShareholder:string):Observable<ResultElection>{
    return this.http.get<ResultElection>(`${ApiUrl}/get-result-election-by-shareholder/${idShareholder}`)
  }
  // delete(id:any):Observable<ResultVoting>{
  //   return this.http.delete<ResultVoting>(`${ApiUrl}/${id}`)
  // }
  create(data:any):Observable<ResultElection>{
    return this.http.post<ResultElection>(`${ApiUrl}/save-election`,data)
  }
  update(id:string,data:any):Observable<ResultElection>{
    return this.http.put<ResultElection>(`${ApiUrl}/${id}`,data)
  }
}