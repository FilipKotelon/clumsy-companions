import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GamePlayerService } from '@core/game/game-player/game-player.service';
import { HandCard, InGameCard } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
  animations: [fadeInOut]
})
export class HandComponent {
  @Input() cards: HandCard[] = [];
  @Input() opponent = false;
  @Input() sleeveImgUrl: string;

  // handCards: HandCard[] = [];

  constructor(private gamePlayerSvc: GamePlayerService) {}

  playCard = (card: HandCard): void => {
    this.gamePlayerSvc.playCard(card, 'player');
  }

  // ngOnInit(): void {
  //   this.handCards = this.cards;
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   const newCards = changes.cards.currentValue as HandCard[];
  //   const cardsToRemove: HandCard[] = [];
  //   const cardsToAdd: HandCard[] = [];

  //   this.handCards.forEach(card => {
  //     if(newCards.findIndex(newCard => newCard.gameObjectId === card.gameObjectId) < 0){
  //       cardsToRemove.push(card);
  //     }
  //   })

  //   newCards.forEach(newCard => {
  //     const handCardId = this.handCards.findIndex(card => card.gameObjectId === newCard.gameObjectId);

  //     if(handCardId < 0){
  //       cardsToAdd.push(newCard);
  //     } else {
  //       this.handCards[handCardId] = newCard;
  //     }
  //   })

  //   cardsToRemove.forEach(cardToR => {
  //     this.handCards.splice(this.handCards.findIndex(card => card.gameObjectId === cardToR.gameObjectId));
  //   })

  //   console.log(cardsToAdd, this.handCards);
  //   cardsToAdd.forEach(cardToA => {
  //     this.handCards.push(cardToA);
  //   })
  // }
}
