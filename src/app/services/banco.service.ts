import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Bancos } from '../interfaces/bancos';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class BancosService {
  private apiUrl = `${appsetting.apiUrl}bancos`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token de autenticación.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllBancos(): Observable<Bancos[]> {
    const headers = this.getHeaders();
    return this.http.get<Bancos[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBancosColombianos(): Observable<Bancos[]> {
    const headers = this.getHeaders();
    return this.http.get<Bancos[]>(`${this.apiUrl}/colombia`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBancosVenezolanos(): Observable<Bancos[]> {
    const headers = this.getHeaders();
    return this.http.get<Bancos[]>(`${this.apiUrl}/venezuela`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
