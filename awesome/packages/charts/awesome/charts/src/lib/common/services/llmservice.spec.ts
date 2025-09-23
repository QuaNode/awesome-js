import { TestBed } from '@angular/core/testing';

import { LLMService } from './llmservice';

describe('LLMService', () => {
  let service: LLMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LLMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
