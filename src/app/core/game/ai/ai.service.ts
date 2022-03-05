import { Injectable } from '@angular/core';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';
import { Subscription } from 'rxjs';
import { GamePlayerService } from '../game-player/game-player.service';
import { GameStateService } from '../game-state/game-state.service';
import { CardFight, CardInPlay, HandCard, PlayerKey, TURN_PHASES } from '../game.types';
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
  iAmPretendingToThink: boolean;
  iAmWaitingForPhase: boolean;
  turnPhaseIndexIAmWaitingFor: number;

  constructor(
    private gamePlayerService: GamePlayerService,
    private gameStateSvc: GameStateService
  ) { }

  //#region my
  get myCurrentEnergy(): number {
    return this.gameState.opponent.energy;
  }

  get myHand(): HandCard[] {
    return this.gameState.opponent.hand;
  }

  get myCardsInPlay(): CardInPlay[] {
    return this.gameState.opponent.cardsInPlay;
  }

  get myPotentialBlockers(): CardInPlay[] {
    return this.gameState[this.myPlayerKey].cardsInPlay.filter(card => !card.tired);
  }
  //#endregion

  //#region player's
  get playersAttackerWithMostStrength(): CardInPlay | null {
    if(!this.playersAttackingCards.length){
      return null;
    }

    let maxStrengthCard = this.playersAttackingCards[0];

    this.playersAttackingCards.forEach(card => {
      if(card.strength > maxStrengthCard.strength){
        maxStrengthCard = card;
      }
    });

    return maxStrengthCard;
  }

  get playersCardsInPlay(): CardInPlay[] {
    return this.gameState.player.cardsInPlay;
  }

  get playersAttackingCards(): CardInPlay[] {
    return this.gameState.player.cardsInPlay.filter(card => card.attacking);
  }
  //#endregion

  //#region iHave
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

  get iHavePotentialDefendingCards(): boolean {
    return this.myPotentialBlockers.length > 0;
  }

  get iHaveNumbersAdvantage(): boolean {
    return this.myCardsInPlay.length >= this.playersCardsInPlay.length + AI_SETTINGS.POTENTIALLY_WORTH_NUMBERS_ADVANTAGE;
  }
  //#endregion

  //#region iShould and iMust
  get iShouldAttack(): boolean {
    const cardsICanAttackWith = this.myCardsInPlay.filter(card =>
      card.strength > 0
      && !card.dizzy && !card.tired
    );
    let lowestStrengthOfThem = 99;

    cardsICanAttackWith.forEach(card => {
      if(card.strength < lowestStrengthOfThem){
        lowestStrengthOfThem = card.strength;
      }
    })

    return (this.cardsIShouldAttackWith.length > 0
        && !this.iMustDefendMyselfAtAllCost)
      || (cardsICanAttackWith.length > this.playersCardsInPlay.length
        && lowestStrengthOfThem >= this.gameState.player.energy);
  }

  get iMustDefendMyselfAtAllCost(): boolean {
    const totalEnemyCompanionStrength = this.playersCardsInPlay.length
      ? this.playersCardsInPlay.reduce((prev, card) => {
        prev += card.strength;
        return prev;
      }, 0)
      : 0;

    return this.myCurrentEnergy <= totalEnemyCompanionStrength;
  }
  //#endregion

  get cardsIShouldAttackWith(): CardInPlay[] {
    if(!this.playersCardsInPlay.length){
      return this.myCardsInPlay.filter(card =>
        card.strength > 0
        && !card.dizzy && !card.tired
      );
    }

    const biggestEnemyCompanionStrength = this.playersCardsInPlay.length
      ? Math.max(...this.playersCardsInPlay.map(card => card.strength))
      : 0;

    const biggestEnemyCompanionEnergy = this.playersCardsInPlay.length
      ? Math.max(...this.playersCardsInPlay.map(card => card.energy))
      : 0;

    return this.myCardsInPlay.filter(card =>
      ((card.energy > biggestEnemyCompanionStrength && card.strength >= biggestEnemyCompanionEnergy)
        || this.iHaveNumbersAdvantage)
      && card.strength > 0
      && !card.dizzy && !card.tired
    );
  }

  get iAmWaiting(): boolean {
    return !this.gameState.continuationApproval.player
      || (this.gameState.counterPlayStatus.canCounter
          && this.gameState.counterPlayStatus.playerKey === 'player')
      || this.gameState.transitioning
      || (this.iAmWaitingForPhase && this.gameState.turnPhaseIndex !== this.turnPhaseIndexIAmWaitingFor)
      || (!this.gameState.counterPlayStatus.canCounter
        && (this.gameState.cardsQueue.length > 0
          || this.gameState.effectsQueue.length > 0
          || this.gameState.stateActionsQueue.length > 0
          || (this.gameState.currentPlayerKey === 'player'
            && TURN_PHASES[this.gameState.turnPhaseIndex].name !== 'defense')));
  }

  //#region iCan
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
  //#endregion

  //#region its
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
  //#endregion

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
    if(this.iAmWaitingForPhase && this.turnPhaseIndexIAmWaitingFor === this.gameState.turnPhaseIndex){
      this.iAmWaitingForPhase = false;
    }

    if(this.iAmPretendingToThink || this.iAmWaiting) return;

    if(this.iCanCounter){
      this.approveContinuation();
      return;
    }

    if(this.iHaveTurn){
      if(this.itsFirstPreparationPhase || this.itsLastPreparationPhase){
        if(this.iHavePlayableCards){
          if(this.iCanPlayFood){
            this.pretendToThink();
            this.playFoodCard();
            return;
          }
          
          if(this.iCanPlayCompanion){
            this.pretendToThink();
            this.playCompanionCard();
            return;
          }
  
          if(this.iCanPlayCharm){
            this.pretendToThink();
            this.playCharmCard();
            return;
          }
  
          if(this.iCanPlayTrick){
            this.pretendToThink();
            this.playTrickCard();
            return;
          }
  
          this.continue();
          return;
        } else {
          this.continue();
          return;
        }
      } else if (this.itsAttackPhase){
        if(this.iHavePotentialAttackingCards && this.iShouldAttack){
          if(this.iHaveAttackingCards){
            this.continue();
            return;
          } else {
            this.chooseAttackers();
            return;
          }
        } else {
          this.continue();
          return;
        }
      } else if (this.itsDefendingPhase){
        return;
      } else if (this.itsDamagePhase){
        return;
      }
    } else {
      if(this.itsDefendingPhase){
        const fightsInDefense = this.getFightsIShouldTakeInDefense();

        if(this.iHavePotentialDefendingCards && (this.iMustDefendMyselfAtAllCost || fightsInDefense.length) && !this.iHaveDefendingCards){
          this.chooseFightsInDefense(fightsInDefense);
          return;
        } else {
          this.continue();
          return;
        }
      }

      this.continue();
      return;
    }
  }

  approveContinuation = (): void => {
    this.gamePlayerService.approveContinuation(this.myPlayerKey);
  }

  continue = (): void => {
    if(this.iHaveTurn){
      if(this.itsFirstPreparationPhase){
        if(this.iHavePotentialAttackingCards && this.iShouldAttack){
          this.gameStateSvc.goToNextPhase();
          return;
        } else {
          this.gameStateSvc.endTurn();
          this.pretendToThink();
          return;
        }
      }
  
      if(this.itsAttackPhase){
        if(this.iHaveAttackingCards && this.iShouldAttack){
          this.gameStateSvc.goToNextPhase();
        } else {
          this.gameStateSvc.endTurn();
          return;
        }
      }
  
      if(this.itsDefendingPhase){
        this.approveContinuation();
        return;
      }
  
      if(this.itsDamagePhase){
        this.approveContinuation();
        return;
      }
  
      if(this.itsLastPreparationPhase){
        this.gameStateSvc.endTurn();
        return;
      }
    } else {
      if(this.itsDefendingPhase){
        this.approveContinuation();
        this.turnPhaseIndexIAmWaitingFor = 3;
        this.iAmWaitingForPhase = true;
        return;
      }
    }
  }

  chooseAttackers = (): void => {
    this.gamePlayerService.chooseAttackers(this.cardsIShouldAttackWith, this.myPlayerKey);
  }

  chooseFightsInDefense = (fights: CardFight[]): void => {
    this.gamePlayerService.chooseFightsInDefense(fights, this.myPlayerKey);
  }

  chooseCardIShouldDefendWith = (blockers: CardInPlay[], playerCard: CardInPlay): CardInPlay | null => {
    const blockerWithMostStrength = this.chooseMyPotentialBlockerWithMostStrength(blockers);
    if(blockerWithMostStrength){
      if(blockerWithMostStrength.strength > playerCard.energy){
        return blockerWithMostStrength;
      } else {
        return this.chooseMyPotentialBlockerWithLeastStrength(blockers);
      }
    }

    return null;
  }

  chooseMyPotentialBlockerWithMostStrength = (blockers: CardInPlay[]): CardInPlay | null => {
    if(!blockers.length){
      return null;
    }

    let maxStrengthCard = blockers[0];

    blockers.forEach(card => {
      if(card.strength > maxStrengthCard.strength){
        maxStrengthCard = card;
      }
    });

    return maxStrengthCard;
  }

  chooseMyPotentialBlockerWithMostEnergy = (blockers: CardInPlay[]): CardInPlay | null => {
    if(!blockers.length){
      return null;
    }

    let maxEnergyCard = blockers[0];

    blockers.forEach(card => {
      if(card.energy > maxEnergyCard.energy){
        maxEnergyCard = card;
      }
    });

    return maxEnergyCard;
  }

  chooseMyPotentialBlockerWithLeastStrength = (blockers: CardInPlay[]): CardInPlay | null => {
    if(!blockers.length){
      return null;
    }

    let minStrengthCard = blockers[0];

    blockers.forEach(card => {
      if(card.strength < minStrengthCard.strength){
        minStrengthCard = card;
      }
    });

    return minStrengthCard;
  }

  getFightsIShouldTakeInDefense = (): CardFight[] => {
    const fights: CardFight[] = [];
    const playerCardsIBlocked: CardInPlay[] = [];
    const myCardsIBlockWith: CardInPlay[] = [];
    const playersAttackingCardsSortedByStrengthASC = [...this.playersAttackingCards].sort((a, b) => a.strength - b.strength);
    const cardsICanBlockWith = [...this.myPotentialBlockers];

    while(playerCardsIBlocked.length < this.playersAttackingCards.length && myCardsIBlockWith.length < this.myPotentialBlockers.length){
      const attacker = playersAttackingCardsSortedByStrengthASC.pop();
      const defender = this.chooseCardIShouldDefendWith(cardsICanBlockWith, attacker);

      if(attacker && defender){
        playerCardsIBlocked.push(attacker);
        myCardsIBlockWith.push(defender);
        cardsICanBlockWith.splice(cardsICanBlockWith.findIndex(card => card.gameObjectId === defender.gameObjectId), 1);
        fights.push({ attacker, defender });
      } else {
        break;
      }
    }

    return fights;
  }

  pretendToThink = (): void => {
    this.iAmPretendingToThink = true;

    setTimeout(() => {
      this.iAmPretendingToThink = false;
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
