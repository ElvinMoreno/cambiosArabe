import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CuentaBancaria } from '../interfaces/cuenta-bancaria';
import { MovimientoDiaDTO} from '../interfaces/MovimientoDiaDTO';
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

  getMovimientosCaja(): Observable<MovimientoDiaDTO> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/movimientos`, {
      headers,
      responseType: 'text' // Recibir como texto para procesar NDJSON
    }).pipe(
      mergeMap(response => {
        const lines = response.split('\n').filter(line => line.trim() !== '');
        return from(lines); // Emitir cada línea como un Observable individual
      }),
      map(line => JSON.parse(line) as MovimientoDiaDTO), // Convertir cada línea JSON a MovimientoDiaDTO
      catchError(this.handleError)
    );
  }
  
  

  modificarFechaMovimiento(movimientoId: number, nuevaFecha: string): Observable<any> {
    const headers = this.getHeaders();
    const requestBody = { nuevaFecha };  // Estructura del cuerpo de la solicitud

    return this.http.put(`${this.apiUrl}/modificar/${movimientoId}`, requestBody, {
      headers,
      responseType: 'text' // Especificamos que la respuesta será de tipo texto
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
