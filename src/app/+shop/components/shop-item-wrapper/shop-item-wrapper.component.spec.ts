import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopItemWrapperComponent } from './shop-item-wrapper.component';

describe('ShopItemWrapperComponent', () => {
  let component: ShopItemWrapperComponent;
  let fixture: ComponentFixture<ShopItemWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopItemWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopItemWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
