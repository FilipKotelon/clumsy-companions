import { TestBed } from '@angular/core/testing';

import { GameConnectorService } from './game-connector.service';

describe('GameConnectorService', () => {
  let service: GameConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
