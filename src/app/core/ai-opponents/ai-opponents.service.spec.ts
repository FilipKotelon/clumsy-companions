import { TestBed } from '@angular/core/testing';

import { AiOpponentsService } from './ai-opponents.service';

describe('AiOpponentsService', () => {
  let service: AiOpponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiOpponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
