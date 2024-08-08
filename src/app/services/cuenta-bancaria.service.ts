import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CuentaBancaria } from '../interfaces/cuenta-bancaria';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class CuentaBancariaService {
  private apiUrl = `${appsetting.apiUrl}cuentas`;

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

  createCuentaBancaria(cuentaBancaria: any): Observable<CuentaBancaria> {
    const headers = this.getHeaders();
    return this.http.post<CuentaBancaria>(this.apiUrl, cuentaBancaria, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

<<<<<<< HEAD
  getCuentaBancariaById(id: number): Observable<CuentaBancaria> {
    const headers = this.getHeaders();
    return this.http.get<CuentaBancaria>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCuentasVenezolanas(): Observable<CuentaBancaria[]> {
=======
  updateCuentaBancaria(id: number, cuentaBancaria: Partial<CuentaBancaria>): Observable<CuentaBancaria> {
>>>>>>> dcec2b4db084cee3e684540accbe8ef397222310
    const headers = this.getHeaders();
    return this.http.put<CuentaBancaria>(`${this.apiUrl}/${id}`, cuentaBancaria, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCuentasColombianas(): Observable<CuentaBancaria[]> {
    const headers = this.getHeaders();
    return this.http.get<CuentaBancaria[]>(`${this.apiUrl}/colombiana`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCuentasVenezolanas(): Observable<CuentaBancaria[]> {
    const headers = this.getHeaders();
    return this.http.get<CuentaBancaria[]>(`${this.apiUrl}/venezolanas`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
