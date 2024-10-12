import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { appsetting } from '../settings/appsetting';
import { SeguimientoDiaDTO } from '../interfaces/seguimiento-dia-dto';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private apiUrl = `${appsetting.apiUrl}balance`;  // Ruta base para los endpoints de balance

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

  // Método para obtener el balance del mes
  calcularCajaPorMes(mes: number, anio: number): Observable<SeguimientoDiaDTO[]> {
    const headers = this.getHeaders();
    const params = { mes: mes.toString(), anio: anio.toString() };  // Parámetros de la solicitud
    return this.http.get<SeguimientoDiaDTO[]>(`${this.apiUrl}/caja/mes`, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error al realizar la solicitud. Por favor, inténtelo nuevamente.'));
  }
}
