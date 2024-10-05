import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment_2 } from '../interfaces/enviroment_2';

@Injectable({
  providedIn: 'root'
})
export class ChatGptService {

  private apiUrl = 'https://api.openai.com/v1/chat/completions';  // URL de la API de OpenAI para chat completions

  constructor(private http: HttpClient) { }

  generateAnswer(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment_2.openaiApiKey}` // Utiliza la clave de acceso desde el archivo de environment
    });

    const body = {
      model: 'gpt-3.5-turbo',  // Cambiar el modelo a `gpt-3.5-turbo`
      messages: [
        { role: 'user', content: prompt }  // Actualizar la estructura según la nueva API
      ],
      max_tokens: 100,            // Número máximo de tokens en la respuesta
      temperature: 0.7            // Controla la creatividad de la respuesta (0.7 es un valor moderado)
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
