import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiDecksComponent } from './ai-decks.component';

describe('AiDecksComponent', () => {
  let component: AiDecksComponent;
  let fixture: ComponentFixture<AiDecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiDecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiDecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
