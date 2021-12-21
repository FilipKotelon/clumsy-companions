import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetsEditComponent } from './sets-edit.component';

describe('SetsEditComponent', () => {
  let component: SetsEditComponent;
  let fixture: ComponentFixture<SetsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
