import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Meeting } from '../models/meeting';
import { HttpHeaders } from '@angular/common/http';

const ApiUrl = "http://10.179.17.67:8080/bvsc-mapp/api/v1/meeting";

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  getByIdCompany(id: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${ApiUrl}/allByCompany/${id}`)
  }

  constructor(private http: HttpClient) { }
  getAll(): Observable<Meeting> {
    return this.http.get<Meeting>(`${ApiUrl}/all`);
  }

  getById(id: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${ApiUrl}/${id}`)
  }

  delete(id: number): Observable<Meeting> {
    return this.http.delete<Meeting>(`${ApiUrl}/${id}`)
  }

  create(data: any): Observable<Meeting> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post<Meeting>(`${ApiUrl}`, data,httpOptions)
  }

  update(id: number, data: any): Observable<Meeting> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.put<Meeting>(`${ApiUrl}/${id}`, data,httpOptions)
  }
}
