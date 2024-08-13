import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Gastos } from '../interfaces/gastos'; // Asegúrate de que esta interfaz esté definida
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private apiUrl = `${appsetting.apiUrl}api/gastos`;

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

  // Manejo de errores
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
