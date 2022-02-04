import { Component, Input } from '@angular/core';
import { CardSize } from '@core/cards/cards.types';
import { InGameCard } from '@core/game/game.types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() card: InGameCard;
  @Input() reportLoad = false;
  @Input() size: CardSize;
  @Input() sleeveImgUrl: string;
}
