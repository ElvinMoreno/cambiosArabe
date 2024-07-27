import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { appsetting } from '../settings/appsetting';

export interface Tasa {
  id: number;
  tasaVenta: number;
  bolivares: number;
  pesos: number;
  sumaTasa: number;
  editable?: boolean; // Añadido para controlar el modo de edición en el frontend
}

@Injectable({
  providedIn: 'root'
})
export class TasaService {
  private apiUrl = `${appsetting.apiUrl}api/tasas`;

  constructor(private http: HttpClient) {}

  getAllTasas(): Observable<Tasa[]> {
    return this.http.get<Tasa[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  updateTasa(id: number, tasa: Tasa): Observable<Tasa> {
    return this.http.put<Tasa>(`${this.apiUrl}/${id}`, tasa).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
