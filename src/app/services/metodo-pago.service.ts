import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MetodoPago } from '../interfaces/metodo-pago';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private apiUrl = `${appsetting.apiUrl}metodos-pago`;

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

  getAllMetodosPago(): Observable<MetodoPago[]> {
    const headers = this.getHeaders();
    return this.http.get<MetodoPago[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
