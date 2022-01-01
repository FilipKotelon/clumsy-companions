import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShopItemWrapperComponent } from './admin-shop-item-wrapper.component';

describe('AdminShopItemWrapperComponent', () => {
  let component: AdminShopItemWrapperComponent;
  let fixture: ComponentFixture<AdminShopItemWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminShopItemWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminShopItemWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
