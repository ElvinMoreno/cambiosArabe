import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraBsDTO } from '../interfaces/compra-bs-dto';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = `${appsetting.apiUrl}compras/index`;

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

  getCompras(): Observable<CompraBsDTO[]> {
    const headers = this.getHeaders();

    console.log(`Making GET request to: ${this.apiUrl}`);  // Log de depuración

    return this.http.get<CompraBsDTO[]>(this.apiUrl, { headers });
  }

  getCompraById(id: number): Observable<CompraBsDTO> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${id}`;

    console.log(`Making GET request to: ${url}`);  // Log de depuración

    return this.http.get<CompraBsDTO>(url, { headers });
  }
}
