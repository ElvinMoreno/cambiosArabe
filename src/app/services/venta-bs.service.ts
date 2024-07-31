import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { VentaBs } from '../interfaces/venta-bs';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class VentaBsService {
  private apiUrl = `${appsetting.apiUrl}venta`;

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

  getAllVentasBs(): Observable<VentaBs[]> {
    const headers = this.getHeaders();
    return this.http.get<VentaBs[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  saveVentaBs(dto: any): Observable<void> {
    const headers = this.getHeaders();
    return this.http.post<void>(this.apiUrl, dto, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
