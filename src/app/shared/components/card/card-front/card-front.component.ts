import { Card, CardSize, CardType, OpenableCardEffect } from '@core/cards/cards.types';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-front',
  templateUrl: './card-front.component.html',
  styleUrls: ['./card-front.component.scss']
})
export class CardFrontComponent implements OnInit{
  @Input() card: Card;
  @Input() permShowName = false;
  @Input() size: CardSize;

  allCardTypes = CardType;
  cardEffects: OpenableCardEffect[] = [];

  ngOnInit(): void {
    if(this.card.type !== CardType.Food){
      this.cardEffects = this.card.effects.map(effect => ({
        open: false,
        effect
      }))
    }
  }
}