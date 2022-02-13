import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsQueueComponent } from './cards-queue.component';

describe('CardsQueueComponent', () => {
  let component: CardsQueueComponent;
  let fixture: ComponentFixture<CardsQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
