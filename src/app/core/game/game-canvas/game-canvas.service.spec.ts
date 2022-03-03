import { TestBed } from '@angular/core/testing';

import { GameCanvasService } from './game-canvas.service';

describe('GameCanvasService', () => {
  let service: GameCanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameCanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
