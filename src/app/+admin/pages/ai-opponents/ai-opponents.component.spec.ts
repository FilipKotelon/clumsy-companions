import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiOpponentsComponent } from './ai-opponents.component';

describe('AiOpponentsComponent', () => {
  let component: AiOpponentsComponent;
  let fixture: ComponentFixture<AiOpponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiOpponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiOpponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
