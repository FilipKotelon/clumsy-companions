import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDeckComponent } from './game-deck.component';

describe('DeckComponent', () => {
  let component: GameDeckComponent;
  let fixture: ComponentFixture<GameDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameDeckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
