import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCardEffectWrapperComponent } from './admin-card-effect-wrapper.component';

describe('AdminCardEffectWrapperComponent', () => {
  let component: AdminCardEffectWrapperComponent;
  let fixture: ComponentFixture<AdminCardEffectWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCardEffectWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCardEffectWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
