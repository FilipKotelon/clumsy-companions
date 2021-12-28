import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminControlWrapperComponent } from './admin-control-wrapper.component';

describe('AdminControlWrapperComponent', () => {
  let component: AdminControlWrapperComponent;
  let fixture: ComponentFixture<AdminControlWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminControlWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminControlWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
