import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FadeCarouselComponent } from './fade-carousel.component';

describe('FadeCarouselComponent', () => {
  let component: FadeCarouselComponent;
  let fixture: ComponentFixture<FadeCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FadeCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FadeCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
