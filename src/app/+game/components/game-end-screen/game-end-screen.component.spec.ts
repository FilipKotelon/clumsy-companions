import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEndScreenComponent } from './game-end-screen.component';

describe('GameEndScreenComponent', () => {
  let component: GameEndScreenComponent;
  let fixture: ComponentFixture<GameEndScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameEndScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameEndScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
