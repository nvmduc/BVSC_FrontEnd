import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../models/company';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/company";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http:HttpClient) { }

  getById(id:number):Observable<Company>{
    return this.http.get<Company>(`${ApiUrl}/${id}`)
  }
}
