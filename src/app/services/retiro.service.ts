import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Retiro } from '../interfaces/retiro';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class RetiroService {
  private apiUrl = `${appsetting.apiUrl}retiros`;

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

  saveRetiro(retiro: Retiro): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/cuenta`, retiro, { headers, responseType: 'text' }) // Cambiar responseType a 'text'
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllRetiros(): Observable<Retiro[]> {
    const headers = this.getHeaders();
    return this.http.get<Retiro[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
