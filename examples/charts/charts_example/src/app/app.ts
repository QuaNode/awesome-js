import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { echartsBaseModel, echartsDerivativeModel, LLMService } from '@awesome/charts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('charts_example');
  baseModel: any;
  derivativeModel: any;

  constructor(private llm: LLMService) {}

  ngOnInit(): void {
    // ✅ test JSON exports
    this.baseModel = echartsBaseModel;
    this.derivativeModel = echartsDerivativeModel;

    console.log('Base model:', this.baseModel);
    console.log('Derivative model:', this.derivativeModel);

   
    this.llm.testValidation();   // should run AJV static validation tests
  }
}
