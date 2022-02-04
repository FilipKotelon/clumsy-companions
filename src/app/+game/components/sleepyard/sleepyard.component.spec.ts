import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepyardComponent } from './sleepyard.component';

describe('SleepyardComponent', () => {
  let component: SleepyardComponent;
  let fixture: ComponentFixture<SleepyardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SleepyardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepyardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
