import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleevesComponent } from './sleeves.component';

describe('SleevesComponent', () => {
  let component: SleevesComponent;
  let fixture: ComponentFixture<SleevesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SleevesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SleevesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
