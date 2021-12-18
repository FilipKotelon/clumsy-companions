import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminItemWrapperComponent } from './admin-item-wrapper.component';

describe('AdminItemWrapperComponent', () => {
  let component: AdminItemWrapperComponent;
  let fixture: ComponentFixture<AdminItemWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminItemWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminItemWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
