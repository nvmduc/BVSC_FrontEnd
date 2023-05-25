import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Shareholder } from '../models/shareholder';

const ApiUrl = "http://localhost:8080/bvsc-mapp/api/v1/shareholder";

const ApiUrlFile = "http://localhost:8080/bvsc-mapp/api/v1/upload-excel";


@Injectable({
  providedIn: 'root'
})
export class ShareholderInfoService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Shareholder> {
    return this.http.get<Shareholder>(`${ApiUrl}/all`);
  }

  getById(id: string): Observable<Shareholder> {
    return this.http.get<Shareholder>(`${ApiUrl}/${id}`)
  }
  getByIdMeeting(id: number): Observable<Shareholder> {
    return this.http.get<Shareholder>(`${ApiUrl}/allByMeeting/${id}`)
  }
  getByIdentityCard(identityCard: string): Observable<Shareholder> {
    return this.http.get<Shareholder>(`${ApiUrl}/getByIC/${identityCard}`)
  }
  delete(id: any): Observable<Shareholder> {
    return this.http.delete<Shareholder>(`${ApiUrl}/${id}`)
  }
  create(data: any): Observable<Shareholder> {
    return this.http.post<Shareholder>(`${ApiUrl}`, data)
  }
  update(id: string, data: any): Observable<Shareholder> {
    return this.http.put<Shareholder>(`${ApiUrl}/${id}`, data)
  }

  uploadExcel(file: File, data: any): Observable<Shareholder> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('idMeeting', data);

    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });

    return this.http.post<Shareholder>(`${ApiUrlFile}`, formData, { headers });
  }
}
