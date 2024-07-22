// services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { appsetting } from '../settings/appsetting';
import { Cliente } from '../interfaces/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${appsetting.apiUrl}cliente`;

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

  getAllClientes(): Observable<Cliente[]> {
    const headers = this.getHeaders();
    return this.http.get<Cliente[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    const headers = this.getHeaders();
    return this.http.post<Cliente>(this.apiUrl, cliente, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
