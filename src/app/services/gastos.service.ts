import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Gastos } from '../interfaces/gastos';
import { PagoGastos } from '../interfaces/pago-gastos';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private apiUrl = `${appsetting.apiUrl}gastos`;

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

  // Obtener todos los gastos
  getAllGastos(): Observable<Gastos[]> {
    const headers = this.getHeaders();
    return this.http.get<Gastos[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener un gasto por ID
  getGastoById(id: number): Observable<Gastos> {
    const headers = this.getHeaders();
    return this.http.get<Gastos>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear un nuevo gasto
  createGasto(gasto: Gastos): Observable<Gastos> {
    const headers = this.getHeaders();
    return this.http.post<Gastos>(this.apiUrl, gasto, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un gasto existente
  updateGasto(id: number, gasto: Gastos): Observable<Gastos> {
    const headers = this.getHeaders();
    return this.http.put<Gastos>(`${this.apiUrl}/${id}`, gasto, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar un gasto
  deleteGasto(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Aumentar saldo de un gasto
  aumentarSaldo(id: number, cantidad: number): Observable<Gastos> {
    const headers = this.getHeaders();
    return this.http.post<Gastos>(`${this.apiUrl}/${id}/aumentarSaldo`, null, {
      headers,
      params: { cantidad: cantidad.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un movimiento de un gasto por ID
  getMovimientoGastoById(id: number): Observable<PagoGastos[]> {
    const headers = this.getHeaders();
    return this.http.get<PagoGastos[]>(`${this.apiUrl}/movimiento/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Modificar la fecha de un movimiento de gasto
  modificarFechaGasto(pagoGastoId: number, nuevaFecha: string): Observable<string> {
    const headers = this.getHeaders();
    const requestBody = { nuevaFecha };
    return this.http.put<string>(`${this.apiUrl}/modificarFecha/${pagoGastoId}`, requestBody, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
