import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Proveedor } from '../interfaces/proveedor';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = `${appsetting.apiUrl}proveedores`;

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
      .pipe(
        catchError(this.handleError)
      );
  }

  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    const headers = this.getHeaders();
    return this.http.post<Proveedor>(this.apiUrl, proveedor, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
