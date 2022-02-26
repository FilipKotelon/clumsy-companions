import { Component, Input } from '@angular/core';
import { CardSize } from '@core/cards/cards.types';
import { CardInPlay, InGameCard } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  animations: [fadeInOut]
})
export class CardComponent {
  @Input() card: InGameCard | CardInPlay;
  @Input() reportLoad = false;
  @Input() size: CardSize;
  @Input() sleeveImgUrl: string;

  get isAttacking(): boolean {
    return 'attacking' in this.card
      ? this.card.attacking
      : false;
  }

  get isDefending(): boolean {
    return 'defending' in this.card
      ? this.card.defending
      : false;
  }
}
