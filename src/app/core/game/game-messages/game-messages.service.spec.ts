import { TestBed } from '@angular/core/testing';

import { GameMessagesService } from './game-messages.service';

describe('GameMessagesService', () => {
  let service: GameMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
