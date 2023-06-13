import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/feedback";
@Injectable({
  providedIn: 'root'
})

export class FeedbackService {

  constructor(private http:HttpClient) { }
  
  getAll():Observable<Feedback>{
    return this.http.get<Feedback>(`${ApiUrl}/all-result-election`);
  }
  
  getByIdMeeting(idMeeting:number):Observable<Feedback>{
    return this.http.get<Feedback>(`${ApiUrl}/get-feedback-by-meeting/${idMeeting}`)
  }
  create(data:any):Observable<Feedback>{
    return this.http.post<Feedback>(`${ApiUrl}`,data)
  }

}
