import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { appsetting } from '../settings/appsetting';
import { HistorialModificaciones } from '../interfaces/historial-notificaciones';

@Injectable({
  providedIn: 'root'
})
export class HistorialNotificacionesService {
  private apiUrl = `${appsetting.apiUrl}historial`;

  constructor(private http: HttpClient) { }

  // Método para obtener las notificaciones del historial
  getHistorialModificaciones(): Observable<HistorialModificaciones[]> {
    const headers = this.getHeaders();
    return this.http.get<HistorialModificaciones[]>(`${this.apiUrl}/lista`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para generar los encabezados de la solicitud
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

  // Manejo de errores en la solicitud
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
