import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleControlComponent } from './toggle-control.component';

describe('ToggleControlComponent', () => {
  let component: ToggleControlComponent;
  let fixture: ComponentFixture<ToggleControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
