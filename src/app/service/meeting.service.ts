import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Meeting } from '../models/meeting';
import { HttpHeaders } from '@angular/common/http';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/meeting";

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  getByIdCompany(id: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${ApiUrl}/allByCompany/${id}`).pipe(tap(s => console.log(id)))
  }

  constructor(private http: HttpClient) { }
  getAll(): Observable<Meeting> {
    return this.http.get<Meeting>(`${ApiUrl}/all`);
  }

  getById(id: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${ApiUrl}/${id}`).pipe(tap(s => console.log(id)))
  }
  delete(id: any): Observable<Meeting> {
    return this.http.delete<Meeting>(`${ApiUrl}/${id}`).pipe(
      tap(() => console.log(id))
    )
  }
  create(data: any): Observable<Meeting> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    
    const options = { headers: httpOptions };


    return this.http.post<Meeting>(`${ApiUrl}`, data,httpOptions).pipe(
      tap(_s => console.log("post")),
    );
  }
  update(id: string, data: any): Observable<Meeting> {
    return this.http.put<Meeting>(`${ApiUrl}/edit/${id}`, data).pipe(
      tap(_s => console.log(id))
    )
  }
}
