import { Component, Input, OnInit } from '@angular/core';
import { CardsService } from '@core/cards/cards.service';
import { Deck } from '@core/decks/decks.types';
import { SleevesService } from '@core/sleeves/sleeves.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {
  @Input() deck: Deck;

  thumbnailImgUrl = '';

  constructor(
    private cardsSvc: CardsService
  ) { }

  ngOnInit(): void {
    this.cardsSvc.getCard(this.deck.thumbnailCardId).subscribe(card => {
      this.thumbnailImgUrl = card.imgUrl;
    });
  }
}
