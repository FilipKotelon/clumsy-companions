import { TestBed } from '@angular/core/testing';

import { GameFightsService } from './game-fights.service';

describe('GameFightsService', () => {
  let service: GameFightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameFightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
