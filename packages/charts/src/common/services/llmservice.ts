import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { echartsOptionsSchema } from '../../schemas/echarts-options.schema';

@Injectable({
  providedIn: 'root'
})
export class LLMService {
  private ajv;
  private validate;

  // Base config
  private apiUrl = 'http://localhost:3000/v1';  // adjust port if needed
  private model = 'gpt4all';                    // adjust depending on model you’re serving

  constructor(private http: HttpClient) {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
    this.validate = this.ajv.compile(echartsOptionsSchema);
  }

  /**
   * Sends a raw message to the LLM API
   */
  send(message: string): Observable<any> {
    const url = `${this.apiUrl}/chat/completions`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const body = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are a chart generator. Return ONLY valid JSON with ECharts options.'
        },
        { role: 'user', content: message }
      ]
    };

    return this.http.post(url, body, { headers });
  }

  /**
   * Generates chart options from natural language query
   */
  generateChartOptions(query: string): Observable<any> {
    return this.send(query).pipe(
      map((response: any) => {
        const raw = response?.choices?.[0]?.message?.content;

        if (!raw) {
          throw new Error('Empty response from LLM');
        }

        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new Error('LLM did not return valid JSON');
        }

        if (!this.validateOptions(parsed)) {
          console.error('Validation errors:', this.validate.errors);
          throw new Error('Response does not match ECharts schema');
        }

        return parsed;
      }),
      catchError((err) => {
        console.error('LLMService error:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Validates ECharts JSON against schema
   */
  validateOptions(json: any): boolean {
    return this.validate(json) as boolean;
  }
}
