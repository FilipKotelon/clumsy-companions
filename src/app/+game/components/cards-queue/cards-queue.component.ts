import { Component, Input, OnInit } from '@angular/core';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { InGameCard } from '@core/game/game.types';
import { fadeInOut } from '@shared/animations/component-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cards-queue',
  templateUrl: './cards-queue.component.html',
  styleUrls: ['./cards-queue.component.scss'],
  animations: [fadeInOut]
})
export class CardsQueueComponent implements OnInit {
  @Input() cards: InGameCard[] = [];

  cardsInQueueSub: Subscription;

  constructor(private gameStateSvc: GameStateService) {}

  ngOnInit(): void {
    this.cardsInQueueSub = this.gameStateSvc.getCardsQueue().subscribe(cards => {
      if(this.cards.length > 0){
        setTimeout(() => {
          this.cards = cards;
        }, 3000);
      } else {
        this.cards = cards;
      }
    });
  }
}
