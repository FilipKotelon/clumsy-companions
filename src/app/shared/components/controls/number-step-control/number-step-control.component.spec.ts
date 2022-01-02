import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberStepControlComponent } from './number-step-control.component';

describe('NumberStepControlComponent', () => {
  let component: NumberStepControlComponent;
  let fixture: ComponentFixture<NumberStepControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberStepControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberStepControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
