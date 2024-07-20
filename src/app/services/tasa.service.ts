import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
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
      throw new Error('No se encontró un token de autenticación.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllTasas(): Observable<Tasa[]> {
    const headers = this.getHeaders();
    return this.http.get<Tasa[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
