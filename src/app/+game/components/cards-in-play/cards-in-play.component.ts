import { Component, Input, OnInit } from '@angular/core';
import { GamePlayerService } from '@core/game/game-player/game-player.service';
import { GameStateService } from '@core/game/game-state/game-state.service';
import { getEffectNeedsFriendlyTarget, getEffectNeedsEnemyTarget } from '@core/game/game.helpers';
import { CardFight, CardInPlay } from '@core/game/game.types';
import { GameEffect } from '@core/game/store/game-effect.actions';

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

  chosenAttackers: CardInPlay[] = [];
  chosenDefenders: CardInPlay[] = [];
  gameState: fromGame.State;
  gameStateSub: Subscription;
  playerPredeclaredDefender: CardInPlay;
  playerPredeclaredDefenderSub: Subscription;

  constructor(
    private gameStateSvc: GameStateService,
    private gamePlayerSvc: GamePlayerService
  ) { }

  get lastEffectOnStack(): GameEffect {
    return this.gameState.effectsQueue.length
      ? this.gameState.effectsQueue[this.gameState.effectsQueue.length - 1]
      : null;
  }

  get lastEffectOnStackNeedsEnemyTarget(): boolean {
    return this.lastEffectOnStack && getEffectNeedsEnemyTarget(this.lastEffectOnStack.type);
  }

  get lastEffectOnStackNeedsFriendlyTarget(): boolean {
    return this.lastEffectOnStack && getEffectNeedsFriendlyTarget(this.lastEffectOnStack.type);
  }

  ngOnInit(): void {
    this.gameStateSub = this.gameStateSvc.getGameState().subscribe(gameState => {
      this.gameState = gameState;
    });

    this.playerPredeclaredDefenderSub = this.gamePlayerSvc.playerPredeclaredDefender$.subscribe(defender => {
      this.playerPredeclaredDefender = defender;
    });
  }

  getIsClickableByPlayer = (card: CardInPlay): boolean => {
    return (
        this.gameState.currentPlayerKey === 'player'
        && !this.opponent
        && ((this.gameState.turnPhaseIndex === 1 && !card.dizzy && !card.tired)
          || this.lastEffectOnStackNeedsFriendlyTarget)
      ) || (
        this.gameState.currentPlayerKey === 'player'
        && this.opponent
        && this.lastEffectOnStackNeedsEnemyTarget
      ) || (
        this.gameState.currentPlayerKey === 'opponent'
        && !this.opponent
        && ((this.gameState.turnPhaseIndex === 2 && !card.tired)
          || this.lastEffectOnStackNeedsFriendlyTarget)
      ) || (
        this.gameState.currentPlayerKey === 'opponent'
        && this.opponent
        && ((this.gameState.turnPhaseIndex === 2 && card.attacking)
          || this.lastEffectOnStackNeedsEnemyTarget)
      );
  }

  clickAction = (card: CardInPlay): void => {
    console.log(this.chosenDefenders);
    if(this.gameState.currentPlayerKey === 'player'){
      if(!this.opponent){
        if(this.gameState.turnPhaseIndex === 1){
          const playerCardsInPlay = [...this.gameState.player.cardsInPlay];

          if(!card.attacking){
            this.gamePlayerSvc.chooseAttackers(
              [...playerCardsInPlay.filter(pCard => pCard.attacking), card],
              'player'
            );
          } else {
            const attackers = playerCardsInPlay.filter(pCard => pCard.attacking);
            attackers.splice(attackers.findIndex(pCard => pCard.gameObjectId === card.gameObjectId), 1);

            this.gamePlayerSvc.chooseAttackers(attackers, 'player');
          }
          return;
        } else if(this.lastEffectOnStackNeedsFriendlyTarget){

          return;
        }
      } else if(this.lastEffectOnStackNeedsEnemyTarget){

        return;
      }
    } else {
      if(!this.opponent){
        if(this.gameState.turnPhaseIndex === 2){
          const cardIsAlreadyADefender = this.gameState.fightQueue.find(fight => fight.defender.gameObjectId === card.gameObjectId);

          if(!this.playerPredeclaredDefender && !cardIsAlreadyADefender){
            this.gamePlayerSvc.predeclareDefender(card);
          } else {
            if(cardIsAlreadyADefender){
              this.gamePlayerSvc.chooseFightsInDefense(
                [...this.gameState.fightQueue.filter(fight => fight.defender.gameObjectId !== card.gameObjectId)],
                'player'
              );
            }

            this.gamePlayerSvc.clearPredeclaredDefender();
          }
          return;
        } else if(this.lastEffectOnStackNeedsFriendlyTarget){

          return;
        }
      } else {
        if(this.gameState.turnPhaseIndex === 2){
          this.gamePlayerSvc.chooseFightsInDefense(
            [
              ...this.gameState.fightQueue,
              { attacker: card, defender: this.playerPredeclaredDefender }
            ],
            'player'
          );

          this.gamePlayerSvc.clearPredeclaredDefender();

          return;
        } else if(this.lastEffectOnStackNeedsEnemyTarget){

          return;
        }
      }
    }
  }
}
