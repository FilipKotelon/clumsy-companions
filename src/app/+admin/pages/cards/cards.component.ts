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
  private idToDelete = '';

  cards: Card[];
  cardSize: CardSize = CardSize.Medium;
  deletePopupOpen: boolean;

  constructor(
    private cardsSvc: CardsService
  ) { }

  ngOnInit(): void {
    this.cardsSvc.getCards().subscribe(cards => {
      this.cards = cards;
    })
  }

  onOpenDeletePopup = (id: string): void => {
    this.idToDelete = id;
    this.deletePopupOpen = true;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
  }

  deleteCard = (): void => {
    this.cardsSvc.deleteCard(this.idToDelete, '/admin/cards');
    this.idToDelete = '';
    this.closeDeletePopup();
  }
}
