import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionHistory } from '../models/transaction-history';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {

  constructor(private http:HttpClient) { }

  getAll():Observable<TransactionHistory>{
    return this.http.get<TransactionHistory>(`${ApiUrl}/all`);
  }

  create(data:any):Observable<TransactionHistory>{
    return this.http.post<TransactionHistory>(`${ApiUrl}`,data)
  }

}
