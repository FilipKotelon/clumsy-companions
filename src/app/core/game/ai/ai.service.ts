import { Injectable } from '@angular/core';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';
import { Subscription } from 'rxjs';
import { GamePlayerService } from '../game-player/game-player.service';
import { GameStateService } from '../game-state/game-state.service';
import { CardInPlay, HandCard, PlayerKey } from '../game.types';
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

  get myCardsInPlay(): CardInPlay[] {
    return this.gameState.opponent.cardsInPlay;
  }

  get myCurrentEnergy(): number {
    return this.gameState.opponent.energy;
  }

  get opponentCardsInPlay(): CardInPlay[] {
    return this.gameState.player.cardsInPlay;
  }

  get iHaveTurn(): boolean {
    return this.gameState.currentPlayerKey === this.myPlayerKey;
  }

  get iHavePlayableCards(): boolean {
    return this.myHand.some(card => card.playable);
  }

  get iHaveAttackingCards(): boolean {
    return this.gameState[this.myPlayerKey].cardsInPlay.filter(card => card.attacking).length > 0;
  }

  get iHaveDefendingCards(): boolean {
    return this.gameState[this.myPlayerKey].cardsInPlay.filter(card => card.defending).length > 0;
  }

  get iHavePotentialAttackingCards(): boolean {
    return this.gameState[this.myPlayerKey].cardsInPlay.filter(card => !card.dizzy && !card.tired).length > 0;
  }

  get iHaveNumbersAdvantage(): boolean {
    return this.myCardsInPlay.length >= this.opponentCardsInPlay.length + AI_SETTINGS.POTENTIALLY_WORTH_NUMBERS_ADVANTAGE;
  }

  get iShouldAttack(): boolean {
    const totalEnemyCompanionStrength = this.opponentCardsInPlay.length
      ? this.opponentCardsInPlay.reduce((prev, card) => {
        prev += card.strength;
        return prev;
      }, 0)
      : 0;

    return this.cardsIShouldAttackWith.length > 0
      && this.myCurrentEnergy > totalEnemyCompanionStrength;
  }

  get cardsIShouldAttackWith(): CardInPlay[] {
    if(!this.opponentCardsInPlay.length){
      return this.myCardsInPlay;
    }

    const biggestEnemyCompanionStrength = this.opponentCardsInPlay.length
      ? Math.max(...this.opponentCardsInPlay.map(card => card.strength))
      : 0;

    const biggestEnemyCompanionEnergy = this.opponentCardsInPlay.length
      ? Math.max(...this.opponentCardsInPlay.map(card => card.energy))
      : 0;

    return this.myCardsInPlay.filter(card =>
      ((card.energy > biggestEnemyCompanionStrength && card.strength >= biggestEnemyCompanionEnergy)
        || this.iHaveNumbersAdvantage)
      && card.strength > 0
    );
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

  get itsFirstPreparationPhase(): boolean {
    return this.gameState.turnPhaseIndex === 0;
  }

  get itsAttackPhase(): boolean {
    return this.gameState.turnPhaseIndex === 1;
  }

  get itsDefendingPhase(): boolean {
    return this.gameState.turnPhaseIndex === 2;
  }

  get itsDamagePhase(): boolean {
    return this.gameState.turnPhaseIndex === 3;
  }

  get itsLastPreparationPhase(): boolean {
    return this.gameState.turnPhaseIndex === 4;
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
      if(this.itsFirstPreparationPhase || this.itsLastPreparationPhase){
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
          this.continue();
          return;
        }
      } else if (this.itsAttackPhase){

      } else if (this.itsDefendingPhase){

      } else if (this.itsDamagePhase){

      }
    }
  }

  approveContinuation = (): void => {
    this.gamePlayerService.approveContinuation(this.myPlayerKey);
  }

  continue = (): void => {
    if(this.itsFirstPreparationPhase){
      if(this.iHavePotentialAttackingCards){
        
      }
      this.pretendToThink();
      return;
    }

    if(this.itsAttackPhase){
      this.pretendToThink();
      return;
    }

    if(this.itsDefendingPhase){
      this.pretendToThink();
      return;
    }

    if(this.itsDamagePhase){
      this.pretendToThink();
      return;
    }

    if(this.itsLastPreparationPhase){
      this.pretendToThink();
      return;
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
