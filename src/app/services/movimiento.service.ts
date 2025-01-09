import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
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


  getMovimientosColombianas(): Observable<MovimientoDiaDTO> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/colombianos`, {
      headers,
      responseType: 'text', // Recibir como texto para procesar NDJSON
    }).pipe(
      mergeMap(response => {
        // Dividir la respuesta en líneas (cada línea es un JSON)
        const lines = response.split('\n').filter(line => line.trim() !== '');
        return from(lines); // Emitir cada línea como un Observable individual
      }),
      map(line => JSON.parse(line) as MovimientoDiaDTO), // Convertir cada línea JSON a MovimientoDiaDTO
      catchError(this.handleError)
    );
  }
  
  getMovimientosVenezolanas(): Observable<MovimientoDiaDTO> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/venezolanos`, {
      headers,
      responseType: 'text', // Recibir como texto para procesar NDJSON
    }).pipe(
      mergeMap(response => {
        // Dividir la respuesta en líneas (cada línea es un JSON)
        const lines = response.split('\n').filter(line => line.trim() !== '');
        return from(lines); // Emitir cada línea como un Observable individual
      }),
      map(line => JSON.parse(line) as MovimientoDiaDTO), // Convertir cada línea JSON a MovimientoDiaDTO
      catchError(this.handleError)
    );
  }
  

  getMovimientosStream(cuentaId: number): Observable<MovimientoDiaDTO> {
    const headers = this.getHeaders();
  
    return this.http.get(`${this.apiUrl}/cuentas/${cuentaId}`, {
      headers,
      responseType: 'text', // Recibir como texto para procesar NDJSON
    }).pipe(
      mergeMap(response => {
        const lines = response.split('\n').filter(line => line.trim() !== '');
  
        return from(lines).pipe(
          map(line => {
            try {
              return JSON.parse(line) as MovimientoDiaDTO; // Convertir cada línea JSON a MovimientoDiaDTO
            } catch (e) {
              console.error('Error parsing line:', line, e);
              throw new Error('Error al procesar una línea del flujo.');
            }
          })
        );
      }),
      catchError(error => {
        console.error('Error en el stream de movimientos:', error);
        return EMPTY; // Detener el flujo en caso de error
      })
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
