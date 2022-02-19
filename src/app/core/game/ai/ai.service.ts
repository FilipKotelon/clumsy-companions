import { Injectable } from '@angular/core';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';
import { Subscription } from 'rxjs';
import { GamePlayerService } from '../game-player/game-player.service';
import { GameStateService } from '../game-state/game-state.service';
import { PlayerKey } from '../game.types';
import { AIDifficulty, AI_SETTINGS } from './ai.types';

import * as fromGame from '@core/game/store/game.reducer';
import { CardType } from '@core/cards/cards.types';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  gameState: fromGame.State;
  gameStateSub: Subscription;
  pretendingToThink: boolean;

  constructor(
    private gamePlayerService: GamePlayerService,
    private gameStateSvc: GameStateService
  ) { }

  get iHaveTurn(): boolean {
    return this.gameState.currentPlayerKey === 'opponent';
  }

  get iHavePlayableCards(): boolean {
    return this.gameState.opponent.hand.some(card => card.playable);
  }

  get iCanPlayFood(): boolean {
    return !this.gameState.opponent.playedFoodThisTurn
      && this.gameState.opponent.hand.some(card => card.type === CardType.Food);
  }

  get iCanPlayCompanion(): boolean {
    return this.gameState.opponent.hand.some(card => card.type === CardType.Companion && card.playable);
  }

  init = (): void => {
    this.gameStateSub = this.gameStateSvc.getGameState().subscribe(state => {
      this.gameState = state;

      if(this.gameState.gameStarted){
        this.analyze();
      }
    });
  }

  reset = (): void => {
    this.gameStateSub.unsubscribe();
  }

  analyze = (): void => {
    if(this.pretendingToThink) return;

    if(this.iHaveTurn){
      if(this.iHavePlayableCards){
        if(this.iCanPlayFood){
          this.playFoodCard();
          this.pretendToThink();
          return;
        }
        
        if(this.iCanPlayCompanion){
          this.playCompanionCard();
          this.pretendToThink();
          return;
        }

        
      } else {

      }
    }
  }

  pretendToThink = (): void => {
    this.pretendingToThink = true;

    setTimeout(() => {
      this.pretendingToThink = false;
      this.analyze();
    }, AI_SETTINGS.PRETENDING_TIME_MS);
  }

  playFoodCard = (): void => {
    const foodCard = this.gameState.opponent.hand.find(card => card.type === CardType.Food);

    if(foodCard){
      this.gamePlayerService.playCard(foodCard, 'opponent');
    }
  }

  playCompanionCard = (): void => {
    const companionCard = this.gameState.opponent.hand.find(card => card.type === CardType.Companion && card.playable);

    if(companionCard){
      this.gamePlayerService.playCard(companionCard, 'opponent');
    }
  }
}
