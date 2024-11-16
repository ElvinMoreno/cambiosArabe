import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MovimientoDiaDTO } from '../interfaces/MovimientoDiaDTO';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiUrl = `${appsetting.apiUrl}movimientos`;

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

  getAllMovimientos(): Observable<MovimientoDiaDTO[]> {
    const headers = this.getHeaders(); // Obtener los encabezados con el token
    return this.http.get<MovimientoDiaDTO[]>(`${this.apiUrl}`, { headers }) // Realizar la solicitud GET
      .pipe(
        catchError(this.handleError) // Manejar errores
      );
  }


  getMovimientosColombianas(): Observable<MovimientoDiaDTO[]> {
    const headers = this.getHeaders();
    return this.http.get<MovimientoDiaDTO[]>(`${this.apiUrl}/colombianos`, { headers }) // URL correcta
      .pipe(
        catchError(this.handleError)
      );
  }

  getMovimientosVenezolanas(): Observable<MovimientoDiaDTO[]> {
    const headers = this.getHeaders();
    return this.http.get<MovimientoDiaDTO[]>(`${this.apiUrl}/venezolanos`, { headers })
      .pipe(catchError(this.handleError));
  }


  getMovimientos(cuentaId: number): Observable<MovimientoDiaDTO[]> {
    const headers = this.getHeaders();
    return this.http.get<MovimientoDiaDTO[]>(`${this.apiUrl}/cuentas/${cuentaId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
  modificarFechaMovimiento(requestBody: { movimientoId: string; nuevaFecha: string }): Observable<string> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/modificarFecha/${requestBody.movimientoId}`, requestBody, {
      headers,
      responseType: 'text' // Indica que la respuesta será texto
    })
    .pipe(
      catchError(this.handleError)
    );
  }
}
