import { CardSize } from './../../../shared/components/card/models/card.model';
import { Component, OnInit } from '@angular/core';

import { CardsService } from '@core/services/cards/cards.service';

import { Card } from '@shared/components/card/models/card.model';

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

  onDelete = (id: string) => {
    console.log(id, 'delete');
  }
}
