import { Component, Input, OnInit } from '@angular/core';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { InGameCard } from '@core/game/game.types';
import { GameEffect } from '@core/game/store/game-effect.actions';
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
  cardsTimeout: NodeJS.Timeout;
  effectsInQueue: GameEffect[] = [];
  effectsInQueueSub: Subscription;
  effectsTimeout: NodeJS.Timeout;

  constructor(private gameStateSvc: GameStateService) {}

  get showEffects(): boolean {
    return this.effectsInQueue.length > 0;
  }

  ngOnInit(): void {
    this.cardsInQueueSub = this.gameStateSvc.getCardsQueue().subscribe(cards => {
      if(this.cards.length > cards.length){
        this.cardsTimeout = setTimeout(() => {
          this.cards = cards;
        }, 3000);
      } else {
        clearTimeout(this.cardsTimeout);
        this.cards = cards;
      }
    });

    this.effectsInQueueSub = this.gameStateSvc.getEffectsQueue().subscribe(effects => {
      if(this.effectsInQueue.length > effects.length){
        this.effectsTimeout = setTimeout(() => {
          this.effectsInQueue = effects;
        }, 3000);
      } else {
        clearTimeout(this.effectsTimeout);
        this.effectsInQueue = effects;
      }
    });
  }
}
