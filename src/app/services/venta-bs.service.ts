import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError, finalize } from 'rxjs';
import { VentaBs } from '../interfaces/venta-bs';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class VentaBsService {
  private apiUrl = `${appsetting.apiUrl}venta`;
  private isSaving = false;

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

  saveVentaBs(dto: VentaBs): Observable<void> {
    if (this.isSaving) {
      return throwError(() => new Error('Solicitud ya en curso'));
    }
    this.isSaving = true;

    const headers = this.getHeaders();
    return this.http.post<void>(`${this.apiUrl}`, dto, { headers })
      .pipe(
        tap(() => {
          this.isSaving = false;
        }),
        catchError((error) => {
          this.isSaving = false;
          return this.handleError(error);
        }),
        finalize(() => {
          this.isSaving = false;
        })
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
