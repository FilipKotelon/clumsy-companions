import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleControlComponent } from './simple-control.component';

describe('SimpleControlComponent', () => {
  let component: SimpleControlComponent;
  let fixture: ComponentFixture<SimpleControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
