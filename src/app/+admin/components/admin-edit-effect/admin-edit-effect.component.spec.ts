import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditEffectComponent } from './admin-edit-effect.component';

describe('AdminEditEffectComponent', () => {
  let component: AdminEditEffectComponent;
  let fixture: ComponentFixture<AdminEditEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditEffectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
