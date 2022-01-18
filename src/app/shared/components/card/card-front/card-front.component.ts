import { Card, CardSize, CardType } from '@core/cards/cards.types';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-front',
  templateUrl: './card-front.component.html'
})
export class CardFrontComponent{
  @Input() card: Card;
  @Input() permShowName = false;
  @Input() size: CardSize;

  allCardTypes = CardType;
  cardEffects: Card[] = [];
}