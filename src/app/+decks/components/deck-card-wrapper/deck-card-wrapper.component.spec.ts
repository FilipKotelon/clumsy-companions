import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckCardWrapperComponent } from './deck-card-wrapper.component';

describe('DeckCardWrapperComponent', () => {
  let component: DeckCardWrapperComponent;
  let fixture: ComponentFixture<DeckCardWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckCardWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckCardWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
