import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleevesEditComponent } from './sleeves-edit.component';

describe('SleevesEditComponent', () => {
  let component: SleevesEditComponent;
  let fixture: ComponentFixture<SleevesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SleevesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SleevesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
