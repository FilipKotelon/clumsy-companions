import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSleeveComponent } from './card-sleeve.component';

describe('CardSleeveComponent', () => {
  let component: CardSleeveComponent;
  let fixture: ComponentFixture<CardSleeveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardSleeveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSleeveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
