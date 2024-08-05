import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllTasas(): Observable<Tasa[]> {
    return this.http.get<Tasa[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateTasa(id: number, tasa: Tasa): Observable<Tasa> {
    return this.http.put<Tasa>(`${this.apiUrl}/${id}`, tasa, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}
