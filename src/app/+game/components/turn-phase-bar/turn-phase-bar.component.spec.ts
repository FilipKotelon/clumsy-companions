import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnPhaseBarComponent } from './turn-phase-bar.component';

describe('TurnPhaseBarComponent', () => {
  let component: TurnPhaseBarComponent;
  let fixture: ComponentFixture<TurnPhaseBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnPhaseBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnPhaseBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
