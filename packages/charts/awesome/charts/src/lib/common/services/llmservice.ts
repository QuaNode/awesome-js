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

  // Configure API base URL and model here
  private readonly apiUrl = 'http://localhost:8000/v1/chat/completions';
  private readonly model = 'gpt4all'; // adjust if needed

  constructor(private http: HttpClient) {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
    this.validate = this.ajv.compile(echartsOptionsSchema);
  }

  /**
   * Generate chart options from user query
   */
  generateChartOptions(query: string): Observable<any> {
    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: 'You are a chart generator. Return ONLY valid JSON with ECharts options.' },
        { role: 'user', content: query }
      ]
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map((response) => {
        const raw = response?.choices?.[0]?.message?.content;
        if (!raw) throw new Error('Empty response from LLM');

        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new Error('LLM did not return valid JSON.');
        }

        if (!this.validateOptions(parsed)) {
          throw new Error('Response does not match ECharts schema.');
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
   * Validate JSON against ECharts schema
   */
  validateOptions(json: any): boolean {
    return this.validate(json) as boolean;
  }

  /**
   * Static test for AJV validator (no LLM needed)
   */
  testValidation(): void {
  const validExample = {
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [120, 200, 150] }]
  };

  const invalidExample = {
    invalidKey: 'oops',
    series: 'this should be an array'
  };

  console.log('--- AJV Static Tests ---');

  const validResult = this.validateOptions(validExample);
  console.log('Valid example result:', validResult);
  if (!validResult) {
    console.log('Valid example errors:', this.validate.errors);
  }

  const invalidResult = this.validateOptions(invalidExample);
  console.log('Invalid example result:', invalidResult);
  if (!invalidResult) {
    console.log('Invalid example errors:', this.validate.errors);
  }
}

}
