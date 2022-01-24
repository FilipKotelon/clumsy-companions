import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiOpponentsEditComponent } from './ai-opponents-edit.component';

describe('AiOpponentsEditComponent', () => {
  let component: AiOpponentsEditComponent;
  let fixture: ComponentFixture<AiOpponentsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiOpponentsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiOpponentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
