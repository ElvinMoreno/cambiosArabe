import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../interfaces/enviroment';

@Injectable({
  providedIn: 'root'
})
export class GemeniService {

  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${environment.keyGemeni}`;

  constructor(private http: HttpClient) { }

  generateAnswer(question: string): Observable<any> {
    const promptUser = environment.promptGemeni + question;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = {
      contents: [{ parts: [{ text: promptUser }] }]
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
