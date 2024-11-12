import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class CuentaDestinatarioService {
  private apiUrl = `${appsetting.apiUrl}cuenta-destinatario`;

  constructor(private http: HttpClient) {}

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

  // Método para realizar el pago parcial
  pagoParcial(cuentaDestinatarioId: number, monto: number): Observable<string> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/pago-parcial/${cuentaDestinatarioId}`;
    const requestBody = { monto }; // Cuerpo de la solicitud con el monto

    return this.http.post<string>(url, requestBody, {  headers, responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
