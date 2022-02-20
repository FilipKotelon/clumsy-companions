import { Injectable } from '@angular/core';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';
import { Subscription } from 'rxjs';
import { GamePlayerService } from '../game-player/game-player.service';
import { GameStateService } from '../game-state/game-state.service';
import { HandCard, PlayerKey } from '../game.types';
import { AIDifficulty, AI_SETTINGS } from './ai.types';

import * as fromGame from '@core/game/store/game.reducer';
import { CardType } from '@core/cards/cards.types';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  myPlayerKey: PlayerKey = 'opponent';

  gameState: fromGame.State;
  gameStateSub: Subscription;
  pretendingToThink: boolean;

  constructor(
    private gamePlayerService: GamePlayerService,
    private gameStateSvc: GameStateService
  ) { }

  get myHand(): HandCard[] {
    return this.gameState.opponent.hand;
  }

  get iHaveTurn(): boolean {
    return this.gameState.currentPlayerKey === this.myPlayerKey;
  }

  get iHavePlayableCards(): boolean {
    return this.myHand.some(card => card.playable);
  }

  get iAmWaiting(): boolean {
    return !this.gameState.continuationApproval.player
      || (this.gameState.counterPlayStatus.canCounter
          && this.gameState.counterPlayStatus.playerKey === 'player')
      || this.gameState.transitioning
      || (!this.gameState.counterPlayStatus.canCounter
        && (this.gameState.cardsQueue.length > 0
          || this.gameState.effectsQueue.length > 0
          || this.gameState.stateActionsQueue.length > 0));
  }

  get iCanCounter(): boolean {
    return this.gameState.counterPlayStatus.canCounter
      && this.gameState.counterPlayStatus.playerKey === this.myPlayerKey;
  }

  get iCanPlayFood(): boolean {
    return !this.gameState.opponent.playedFoodThisTurn
      && this.myHand.some(card => card.type === CardType.Food);
  }

  get iCanPlayCompanion(): boolean {
    return this.myHand.some(card => card.type === CardType.Companion && card.playable);
  }

  get iCanPlayCharm(): boolean {
    return this.myHand.some(card => card.type === CardType.Charm && card.playable);
  }

  get iCanPlayTrick(): boolean {
    return this.myHand.some(card => card.type === CardType.Trick && card.playable);
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
    this.gameState = null;
    this.gameStateSub.unsubscribe();
  }

  analyze = (): void => {
    if(this.pretendingToThink || this.iAmWaiting) return;

    if(this.iCanCounter){
      if(this.iCanPlayTrick){
        this.playTrickCard();
        return;
      } else {
        this.approveContinuation();
        return;
      }
    }

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

        if(this.iCanPlayCharm){
          this.playCharmCard();
          this.pretendToThink();
          return;
        }

        if(this.iCanPlayTrick){
          this.continue();
          return;
        }

        this.continue();
        return;
      } else {
        console.log('here');
        this.continue();
        return;
      }
    }
  }

  approveContinuation = (): void => {
    this.gamePlayerService.approveContinuation(this.myPlayerKey);
  }

  continue = (): void => {
    console.log('I will continue');
  }

  pretendToThink = (): void => {
    this.pretendingToThink = true;

    setTimeout(() => {
      this.pretendingToThink = false;
      this.analyze();
    }, AI_SETTINGS.PRETENDING_TIME_MS);
  }

  playFoodCard = (): void => {
    const foodCard = this.myHand.find(card => card.type === CardType.Food);

    if(foodCard){
      this.gamePlayerService.playCard(foodCard, this.myPlayerKey);
    }
  }

  playCompanionCard = (): void => {
    const companionCard = this.myHand.find(card => card.type === CardType.Companion && card.playable);

    if(companionCard){
      this.gamePlayerService.playCard(companionCard, this.myPlayerKey);
    }
  }

  playCharmCard = (): void => {
    const charmCard = this.myHand.find(card => card.type === CardType.Charm && card.playable);

    if(charmCard){
      this.gamePlayerService.playCard(charmCard, this.myPlayerKey);
    }
  }

  playTrickCard = (): void => {
    const trickCard = this.myHand.find(card => card.type === CardType.Trick && card.playable);

    if(trickCard){
      this.gamePlayerService.playCard(trickCard, this.myPlayerKey);
    }
  }
}
