import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckWrapperComponent } from './deck-wrapper.component';

describe('DeckWrapperComponent', () => {
  let component: DeckWrapperComponent;
  let fixture: ComponentFixture<DeckWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
