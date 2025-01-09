import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError, tap, finalize, map, mergeMap } from 'rxjs/operators';
import { VentaBs } from '../interfaces/venta-bs';
import { appsetting } from '../settings/appsetting';
import { VentaPagos } from '../interfaces/venta-pagos';
import { Crearventa } from '../interfaces/crearventa';
import { CuentaDestinatario } from '../interfaces/cuenta-destinatario';
import { TraerVenta } from '../interfaces/traer-venta';
import { VentaAllDTO } from '../interfaces/VentaAllDTO';

@Injectable({
  providedIn: 'root'
})
export class VentaBsService {
  private apiUrl = `${appsetting.apiUrl}venta`;
  private isSaving = false;

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

  getAllVentasBs(): Observable<VentaAllDTO> {
    const headers = this.getHeaders();
  
    return this.http.get(this.apiUrl, {
      headers,
      responseType: 'text', // Recibir como texto para procesar NDJSON
    }).pipe(
      mergeMap(response => {
        // Dividir la respuesta en líneas (cada línea es un JSON válido)
        const lines = response.split('\n').filter(line => line.trim() !== '');
        return from(lines); // Emitir cada línea como un Observable individual
      }),
      map(line => {
        try {
          return JSON.parse(line) as VentaAllDTO; // Intentar parsear cada línea como JSON
        } catch (error) {
          console.error('Error al parsear la línea:', line, error);
          throw error; // Lanzar error si el JSON es inválido
        }
      }),
      catchError(error => {
        console.error('Error al procesar las ventas:', error);
        return EMPTY; // Detener el flujo en caso de error
      })
    );
  }
  
  
  getVentaBsById(id: number): Observable<VentaBs> {
    const headers = this.getHeaders();
    return this.http.get<VentaBs>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  saveVentaBs(dto: Crearventa): Observable<void> {
    if (this.isSaving) {
      return throwError(() => new Error('Solicitud ya en curso'));
    }
    this.isSaving = true;

    const headers = this.getHeaders();
    return this.http.post<void>(`${this.apiUrl}/save`, dto, { headers })
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

  updateVentaBs(id: number, dto: VentaBs): Observable<VentaBs> {
    const headers = this.getHeaders();
    return this.http.put<VentaBs>(`${this.apiUrl}/${id}`, dto, { headers })
      .pipe(catchError(this.handleError));
  }

  getVentasSalidas(): Observable<CuentaDestinatario[]> {
    const headers = this.getHeaders();
    return this.http.get<CuentaDestinatario[]>(`${this.apiUrl}/ventas-salida`, { headers })
      .pipe(catchError(this.handleError));
  }

  getVentasEntradas(cuentaBancariaId: number): Observable<VentaPagos[]> {
    const headers = this.getHeaders();
    return this.http.get<VentaPagos[]>(`${this.apiUrl}/entradas/${cuentaBancariaId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  confirmarVentasEntrada(ventas: VentaPagos[]): Observable<void> {
    const headers = this.getHeaders();
    return this.http.post<void>(`${this.apiUrl}/confirmar-entradas`, ventas, { headers })
      .pipe(catchError(this.handleError));
  }

  confirmarVentaSalida(ventas: CuentaDestinatario[]): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/salida`, ventas, { headers, responseType: 'text' })  // Enviar array de ventas
      .pipe(catchError(this.handleError));
  }

  getVentasEntradasCB(cuentaBancariaId: number): Observable<VentaPagos[]> {
    const headers = this.getHeaders();
    return this.http.get<VentaPagos[]>(`${this.apiUrl}/entradas/${cuentaBancariaId}`, { headers })
      .pipe(catchError(this.handleError));
}


  // Método para eliminar una venta por ID
  eliminarVentaPorId(ventaId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${ventaId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
  updateBancoBs(ventaBsId: number, cuentaBolivaresId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.post<void>(`${this.apiUrl}/update-bancoBs/${ventaBsId}/${cuentaBolivaresId}`, {}, { headers })
      .pipe(catchError(this.handleError));
  }

}
