import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  private apiUrl = 'https://api.openai.com/v1/chat/completions'; // Endpoint correcto
  private apiKey = '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'; // Coloca tu API Key aquí // Coloca tu API Key aquí (no la compartas públicamente)

  constructor(private http: HttpClient) { }

  sendPrompt(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-3.5-turbo',  // Cambia a este modelo para mayor disponibilidad
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 100
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
