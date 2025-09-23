// packages/charts/awesome/charts/src/lib/charts.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LLMService } from './common/services/llmservice';



@NgModule({
providers: [LLMService],
  imports: [
    CommonModule  
  ],
exports: []
})
export class ChartsModule {}
