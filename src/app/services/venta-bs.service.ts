import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError, finalize, map, switchMap } from 'rxjs';
import { VentaBs } from '../interfaces/venta-bs';
import { appsetting } from '../settings/appsetting';
import { VentaPagos } from '../interfaces/venta-pagos';
import { CuentaBancaria } from '../interfaces/cuenta-bancaria';

@Injectable({
  providedIn: 'root'
})
export class VentaBsService {
  private apiUrl = `${appsetting.apiUrl}venta`;
  private isSaving = false;

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

  getAllVentasBs(): Observable<VentaBs[]> {
    const headers = this.getHeaders();
    return this.http.get<VentaBs[]>(this.apiUrl, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  saveVentaBs(dto: VentaBs): Observable<void> {
    if (this.isSaving) {
      return throwError(() => new Error('Solicitud ya en curso'));
    }
    this.isSaving = true;

    const headers = this.getHeaders();
    return this.http.post<void>(`${this.apiUrl}`, dto, { headers })
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

  getVentasSalidas(): Observable<VentaPagos[]> {
    const headers = this.getHeaders();
    return this.http.get<VentaPagos[]>(`${this.apiUrl}/ventas-salida`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getVentasEntradas(): Observable<VentaPagos[]> {
    const headers = this.getHeaders();
    return this.http.get<VentaPagos[]>(`${this.apiUrl}/ventas-entradas`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  confirmarVentaEntrada(dto: VentaPagos): Observable<string> {
    const headers = this.getHeaders();

    // Buscar la cuenta bancaria correspondiente
    return this.getCuentaBancariaPorNombre(dto.nombreCuentaCop).pipe(
      switchMap(cuenta => {
        if (cuenta) {
          // Agregar el responsable al DTO
          const dtoConResponsable = {
            ...dto,
            responsable: cuenta.responsabe // Nota: hay un error de ortografía en la interfaz CuentaBancaria
          };
          return this.http.post<string>(`${this.apiUrl}/entrada`, dtoConResponsable, { headers });
        } else {
          throw new Error('No se encontró la cuenta bancaria correspondiente');
        }
      }),
      catchError(this.handleError)
    );
  }

  private getCuentaBancariaPorNombre(nombreCuenta: string): Observable<CuentaBancaria | undefined> {
    return this.http.get<CuentaBancaria[]>(`${appsetting.apiUrl}cuentas`, { headers: this.getHeaders() }).pipe(
      map(cuentas => cuentas.find(cuenta => cuenta.nombreCuenta === nombreCuenta)),
      catchError(this.handleError)
    );
  }


  confirmarVentaSalida(dto: VentaPagos): Observable<string> {
    const headers = this.getHeaders();
    return this.http.post<string>(`${this.apiUrl}/salida`, dto, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
