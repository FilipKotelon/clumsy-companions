import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsInPlayComponent } from './cards-in-play.component';

describe('CardsInPlayComponent', () => {
  let component: CardsInPlayComponent;
  let fixture: ComponentFixture<CardsInPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsInPlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsInPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
