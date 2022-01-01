import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacksEditComponent } from './packs-edit.component';

describe('PacksEditComponent', () => {
  let component: PacksEditComponent;
  let fixture: ComponentFixture<PacksEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacksEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacksEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
