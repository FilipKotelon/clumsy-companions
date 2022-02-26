import { Component, Input, OnInit } from '@angular/core';
import { GamePlayerService } from '@core/game/game-player/game-player.service';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { getEffectNeedsTarget } from '@core/game/game.helpers';
import { CardFight, CardInPlay } from '@core/game/game.types';

import * as fromGame from '@core/game/store/game.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cards-in-play',
  templateUrl: './cards-in-play.component.html',
  styleUrls: ['./cards-in-play.component.scss']
})
export class CardsInPlayComponent implements OnInit {
  @Input() cards: CardInPlay[] = [];
  @Input() opponent = false;
  @Input() sleeveImgUrl: string;

  chosenFights: CardFight[];
  gameState: fromGame.State;
  gameStateSub: Subscription;

  constructor(
    private gameStateSvc: GameStateService,
    private gamePlayerSvc: GamePlayerService
  ) { }

  ngOnInit(): void {
    this.gameStateSub = this.gameStateSvc.getGameState().subscribe(gameState => {
      this.gameState = gameState;
    });
  }

  get clickableByPlayer(): boolean {
    return (this.gameState.currentPlayerKey === 'player'
        && !this.opponent
        && (this.gameState.turnPhaseIndex === 1
          || this.gameState.turnPhaseIndex === 2
          || getEffectNeedsTarget(this.gameState.effectsQueue[this.gameState.effectsQueue.length - 1].type)))
      || (this.gameState.currentPlayerKey === 'opponent'
        && this.opponent
        )
  }

  getIsClickableByPlayer = (card: CardInPlay): boolean => {
    return this.clickableByPlayer

  }
}
