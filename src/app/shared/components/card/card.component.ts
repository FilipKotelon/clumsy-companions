import { Component, Input } from '@angular/core';
import { CardSize } from '@core/cards/cards.types';
import { CardInPlay, InGameCard } from '@core/game/game.types';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() card: InGameCard | CardInPlay;
  @Input() reportLoad = false;
  @Input() showEffects: boolean = false;
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
