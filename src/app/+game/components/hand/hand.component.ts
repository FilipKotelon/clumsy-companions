import { Component, Input } from '@angular/core';
import { CardType } from '@core/cards/cards.types';
import { GamePlayerService } from '@core/game/game-player/game-player.service';
import { InGameCard } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
  animations: [fadeInOut]
})
export class HandComponent {
  @Input() cards: InGameCard[] = [];
  @Input() opponent = false;
  @Input() sleeveImgUrl: string;

  constructor(private gamePlayerSvc: GamePlayerService) {}

  isCardPlayable = (card: InGameCard): boolean => {
    return card.type === CardType.Food;
  }

  playCard = (card: InGameCard): void => {
    this.gamePlayerSvc.playCard(card, 'player');
  }
}
