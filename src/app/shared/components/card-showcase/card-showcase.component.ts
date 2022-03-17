import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '@core/cards/cards.types';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-card-showcase',
  templateUrl: './card-showcase.component.html',
  styleUrls: ['./card-showcase.component.scss'],
  animations: [fadeInOut]
})
export class CardShowcaseComponent {
  @Input() card: Card;
  @Output() closed = new EventEmitter<void>();

  close = (): void => {
    this.closed.emit();
  }
}
