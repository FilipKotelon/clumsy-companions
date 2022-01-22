import { TestBed } from '@angular/core/testing';

import { SleevesService } from './sleeves.service';

describe('SleevesService', () => {
  let service: SleevesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SleevesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
