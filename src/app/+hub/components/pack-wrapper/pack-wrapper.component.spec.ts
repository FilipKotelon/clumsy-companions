import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackWrapperComponent } from './pack-wrapper.component';

describe('PackWrapperComponent', () => {
  let component: PackWrapperComponent;
  let fixture: ComponentFixture<PackWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
