import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardsService } from '@core/cards/cards.service';
import { Card } from '@core/cards/cards.types';
import { LoadingService } from '@core/loading/loading.service';
import { PlayerService } from '@core/player/player.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnDestroy {
  cardForShowcase: Card;
  cardsSub: Subscription;
  cards: Card[];

  constructor(
    private cardsService: CardsService,
    private gamePlayerSvc: PlayerService,
    private loadingSvc: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadingSvc.addLoadingTask('LOAD_COLLECTION');

    this.cardsSub = this.gamePlayerSvc.getOwnedCardsIds().pipe(
      switchMap(ids => {
        return this.cardsService.getCards({ ids });
      })
    ).subscribe(cards => {
      this.cards = cards;
      this.cards.sort((a, b) => {
        return a.cost - b.cost;
      });
      this.loadingSvc.removeLoadingTask('LOAD_COLLECTION');
    });
  }

  ngOnDestroy(): void {
    this.cardsSub.unsubscribe();
  }

  selectCardForShowcase = (card: Card): void => {
    this.cardForShowcase = card;
  }

  closeShowcase = (): void => {
    this.cardForShowcase = null;
  }
}
