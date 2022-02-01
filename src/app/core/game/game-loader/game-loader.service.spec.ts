import { TestBed } from '@angular/core/testing';

import { GameLoaderService } from './game-loader.service';

describe('GameLoaderService', () => {
  let service: GameLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
