import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tasa } from '../interfaces/tasa';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class TasaService {
  private apiUrl = `${appsetting.apiUrl}api/tasas`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllTasas(): Observable<Tasa[]> {
    return this.http.get<Tasa[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  updateTasa(id: number, tasa: Tasa): Observable<Tasa> {
    return this.http.put<Tasa>(`${this.apiUrl}/${id}`, tasa, { headers: this.getHeaders() });
  }
}
