// cloudinary.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { appsetting } from '../settings/appsetting';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private baseUrl = `${appsetting.apiUrl}api/cloudinary`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token de autenticación.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Método actualizado para aceptar FormData directamente
  uploadImage(formData: FormData): Observable<any> {
    const headers = this.getHeaders();

    // Aquí usamos formData directamente como lo envía el componente
    return this.http.post(`${this.baseUrl}/upload`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  getOptimizedUrl(publicId: string): Observable<string> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/optimize/${publicId}`, { headers, responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  getAutoCropUrl(publicId: string): Observable<string> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/autocrop/${publicId}`, { headers, responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'));
  }
}
