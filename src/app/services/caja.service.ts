import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CuentaBancaria } from '../interfaces/cuenta-bancaria';
import { Movimiento} from '../interfaces/movimiento';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private apiUrl = `${appsetting.apiUrl}caja`;

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

  getCajaDatos(): Observable<CuentaBancaria> {
    const headers = this.getHeaders();
    return this.http.get<CuentaBancaria>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMovimientosCaja(): Observable<Movimiento[]> {
    const headers = this.getHeaders();
    return this.http.get<Movimiento[]>(`${this.apiUrl}/movimientos`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
