import { CardSize } from '@core/cards/cards.types';
import { Component, OnInit } from '@angular/core';

import { CardsService } from '@core/cards/cards.service';

import { Card } from '@core/cards/cards.types';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  cards: Card[];
  cardSize: CardSize = CardSize.Medium;

  constructor(
    private cardsSvc: CardsService
  ) { }

  ngOnInit(): void {
    this.cardsSvc.getCards().subscribe(cards => {
      this.cards = cards;
    })
  }

  onDelete = (id: string): void => {
    console.log(id, 'delete');
  }
}
