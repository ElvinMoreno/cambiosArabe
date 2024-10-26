import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class ModificarFechaVenezolanaService {
  private apiUrl = `${appsetting.apiUrl}venezolana`; // Endpoint base para movimientos venezolanos

  constructor(private http: HttpClient) {}

  // Obtener encabezados con autenticación
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
   * Método para modificar la fecha de un movimiento venezolano.
   * @param movimientoId - ID del movimiento.
   * @param nuevaFecha - Nueva fecha en formato 'yyyy-MM-dd' o 'yyyy-MM-ddTHH:mm:ss'.
   * @returns Observable<string> - Respuesta del servidor en texto.
   */
  modificarFechaMovimientoVenezolano(movimientoId: number, nuevaFecha: string): Observable<string> {
    const headers = this.getHeaders();
    const requestBody = { nuevaFecha };

    return this.http.put(`${this.apiUrl}/modificar/${movimientoId}`, requestBody, { headers, responseType: 'text' })
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
    console.error('Ocurrió un error en la solicitud:', error);
    return throwError(() => new Error('Error en la solicitud. Inténtelo nuevamente.'));
  }
}
