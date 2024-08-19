import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Pendiente } from '../interfaces/pendiente';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class PendienteService {
  private apiUrl = `${appsetting.apiUrl}pendientes`;

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

  // Obtener un pendiente por ID
  getPendienteById(id: number): Observable<Pendiente> {
    const headers = this.getHeaders();
    return this.http.get<Pendiente>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Crear un nuevo pendiente
  createPendiente(pendiente: Pendiente): Observable<Pendiente> {
    const headers = this.getHeaders();
    return this.http.post<Pendiente>(this.apiUrl, pendiente, { headers })
      .pipe(catchError(this.handleError));
  }

  // Actualizar un pendiente existente
  updatePendiente(id: number, pendiente: Pendiente): Observable<Pendiente> {
    const headers = this.getHeaders();
    return this.http.put<Pendiente>(`${this.apiUrl}/${id}`, pendiente, { headers })
      .pipe(catchError(this.handleError));
  }

  // Eliminar un pendiente por ID
  deletePendiente(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
