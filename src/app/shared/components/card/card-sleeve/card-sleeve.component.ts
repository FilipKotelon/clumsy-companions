import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-sleeve',
  template: `
    <div class="card-sleeve">
      <img [src]="sleeveImgUrl" alt="Card Sleeve" class="card-sleeve__img">
    </div>
  `
})
export class CardSleeveComponent {
  @Input() sleeveImgUrl: string;
}
