import { Component, Input, OnInit } from '@angular/core';
import { CardsService } from '@core/cards/cards.service';
import { Deck } from '@core/decks/decks.types';
import { SleevesService } from '@core/sleeves/sleeves.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {
  @Input() deck: Deck;

  sleeveImgUrl = '';
  thumbnailImgUrl = '';

  constructor(
    private cardsSvc: CardsService,
    private sleevesSvc: SleevesService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.sleevesSvc.getSleeve(this.deck.sleeveId),
      this.cardsSvc.getCard(this.deck.thumbnailCardId)
    ])
    .subscribe(([sleeve, card]) => {
      this.sleeveImgUrl = sleeve.imgUrl;
      this.thumbnailImgUrl = card.imgUrl;
    });
  }
}
