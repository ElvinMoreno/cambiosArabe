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

  /**
   * Método para obtener todos los movimientos de cuentas colombianas.
   * @returns Observable<MovimientoDiaDTO[]> - Lista de movimientos de cuentas colombianas.
   */
  getMovimientosColombianas(): Observable<MovimientoDiaDTO[]> {
    const headers = this.getHeaders();
    return this.http.get<MovimientoDiaDTO[]>(`${this.apiUrl}/colombianos`, { headers }) // URL correcta
      .pipe(
        catchError(this.handleError)
      );
  }
  

  /**
   * Método para obtener los movimientos de una cuenta venezolana específica.
   * @param cuentaId - ID de la cuenta venezolana.
   * @returns Observable<MovimientoDiaDTO[]> - Lista de movimientos de la cuenta venezolana.
   */
  getMovimientosVenezolanas(cuentaId: number): Observable<MovimientoDiaDTO[]> {
    const headers = this.getHeaders();
    return this.http.get<MovimientoDiaDTO[]>(`${this.apiUrl}/cuentas/${cuentaId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Manejo de errores para solicitudes HTTP.
   * @param error - Error recibido.
   * @returns Observable<Error> - Error procesado.
   */
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
