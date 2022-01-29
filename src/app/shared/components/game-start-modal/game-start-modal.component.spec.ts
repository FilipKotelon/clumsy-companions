import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStartModalComponent } from './game-start-modal.component';

describe('GameStartModalComponent', () => {
  let component: GameStartModalComponent;
  let fixture: ComponentFixture<GameStartModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameStartModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
