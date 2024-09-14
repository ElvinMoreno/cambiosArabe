import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Proveedor } from '../interfaces/proveedor';
import { CreditoProveedor } from '../interfaces/creditoProveedor';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = `${appsetting.apiUrl}proveedores`;
  private apiCreditosUrl = `${appsetting.apiUrl}creditos-proveedor`;

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

  getAllProveedores(): Observable<Proveedor[]> {
    const headers = this.getHeaders();
    return this.http.get<Proveedor[]>(this.apiUrl, { headers })
      .pipe(catchError(this.handleError));
  }

  getCreditosByProveedorId(proveedorId: number): Observable<CreditoProveedor[]> {
    const headers = this.getHeaders();
    return this.http.get<CreditoProveedor[]>(`${this.apiCreditosUrl}/${proveedorId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Agregar este método para obtener un proveedor por ID
  getProveedorById(proveedorId: number): Observable<Proveedor> {
    const headers = this.getHeaders();
    return this.http.get<Proveedor>(`${this.apiUrl}/${proveedorId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}

