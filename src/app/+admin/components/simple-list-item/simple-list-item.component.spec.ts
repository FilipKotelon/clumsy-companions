import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleListItemComponent } from './simple-list-item.component';

describe('SimpleListItemComponent', () => {
  let component: SimpleListItemComponent;
  let fixture: ComponentFixture<SimpleListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
