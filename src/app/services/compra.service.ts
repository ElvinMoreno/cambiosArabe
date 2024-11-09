import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CompraBsDTO } from '../interfaces/compra-bs-dto';
import { appsetting } from '../settings/appsetting';
import { ActualizarCompraDTO } from '../interfaces/actualizar-compras-dto';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = `${appsetting.apiUrl}compras`;

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
    return this.http.get<CompraBsDTO[]>(`${this.apiUrl}/index`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCompraById(id: number): Observable<CompraBsDTO> {
    const headers = this.getHeaders();
    return this.http.get<CompraBsDTO>(`${this.apiUrl}/index/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCompraByIdAct(id: number): Observable<ActualizarCompraDTO> {
    const headers = this.getHeaders();
    return this.http.get<ActualizarCompraDTO>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  newCompraBs(dto: CompraBsDTO): Observable<void> {
    const headers = this.getHeaders();
    return this.http.post<void>(`${this.apiUrl}`, dto, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCompra(id: number, dto: ActualizarCompraDTO): Observable<CompraBsDTO> {
    const headers = this.getHeaders();
    return this.http.put<CompraBsDTO>(`${this.apiUrl}/${id}`, dto, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  calcularEquivalenteEnPesos(cuentaBancariaBsId: number): Observable<number> {
    const headers = this.getHeaders();
    return this.http.get<number>(`${this.apiUrl}/equivalente-pesos/${cuentaBancariaBsId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para obtener las compras de entrada
  getComprasEntradas(): Observable<CompraBsDTO[]> {
    const headers = this.getHeaders();
    return this.http.get<CompraBsDTO[]>(`${this.apiUrl}/compra-entradas`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para confirmar la entrada de una compra

  confirmarVentaEntrada(compra: CompraBsDTO): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post<string>(`${this.apiUrl}/entrada`, compra, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
