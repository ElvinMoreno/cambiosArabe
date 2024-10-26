import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class HuggingFaceService {

  private baseUrl = `${appsetting.apiUrl}api/huggingface`;

  constructor(private http: HttpClient) { }

  // Método para obtener encabezados con token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No se encontró un token de autenticación. Algunas solicitudes podrían fallar.');
    }

    return headers;
  }

  // Método para enviar consultas al modelo de Hugging Face
  queryModel(input: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { inputs: input };

    return this.http.post<any>(`${this.baseUrl}/predict`, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: any) {
    let errorMessage = 'Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente o de red
      console.error('Error del cliente:', error.error.message);
    } else {
      // Error del backend
      console.error(`Código de error del servidor: ${error.status}\nMensaje: ${error.message}`);
      if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor, inicia sesión de nuevo.';
      } else if (error.status === 403) {
        errorMessage = 'Acceso denegado. No tienes permisos para realizar esta acción.';
      } else if (error.status === 404) {
        errorMessage = 'No se encontró el recurso solicitado.';
      } else if (error.status >= 500) {
        errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
