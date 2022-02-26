import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { map } from '@firebase/util';
import { of } from 'rxjs';

import { GameConnectorService } from '@core/game/game-connector/game-connector.service';

import * as GameStateActions from '@core/game/store/game-state.actions';
import * as GameEffectActions from '@core/game/store/game-effect.actions';
import * as fromStore from '@core/store/reducer';
import * as GameSelectors from '@core/game/store/game.selectors';
import { GameFightsService } from '../game-fights/game-fights.service';
import { getCardPlayableCheckPayload, getEffectNeedsTarget, getHasPlayableCards, getOtherPlayerKey } from '../game.helpers';

@Injectable()
export class GameStateEffects {
  constructor(
    private actions$: Actions,
    private gameConnectorSvc: GameConnectorService,
    private gameFightsSvc: GameFightsService,
    private router: Router,
    private store: Store<fromStore.AppState>
  ) {}

  loadStart$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameLoadStart),
    switchMap(({ type, ...data }) => {
      this.router.navigate(['/game/']);

      return this.gameConnectorSvc.loadPlayers(data);
    })
  ))

  chooseFirstPlayer$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameChooseFirstPlayer),
    tap(() => {
      setTimeout(() => {
        this.store.dispatch(GameStateActions.gameStart());
      }, 3000);
    })
  ), { dispatch: false })

  playCard$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gamePlayCard),
    withLatestFrom(this.store.select(GameSelectors.selectContinuationApproval)),
    tap(([{ type, ...payload }, approval]) => {
      if(approval.opponent && approval.player){
        this.store.dispatch(GameStateActions.gameResolveCard({ card: payload.card, playerKey: payload.playerKey }));
      }
    })
  ), { dispatch: false })

  resolveCard$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameResolveCard),
    withLatestFrom(this.store.select(GameSelectors.selectEffectsQueue)),
    tap(([{ type, ...payload }, effectsQueue]) => {
      if(effectsQueue.length){
        const nextEffect = effectsQueue[effectsQueue.length - 1];

        if(!getEffectNeedsTarget(nextEffect.type)){
          this.store.dispatch(nextEffect.getAction(nextEffect.payload) as Action);
        }
      } else {
        this.store.dispatch(GameStateActions.gameResolveCardInQueue({ card: payload.card }));
      }
    })
  ), { dispatch: false })

  approveContinuation$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameApproveContinuation),
    withLatestFrom(
      this.store.select(GameSelectors.selectContinuationApproval),
      this.store.select(GameSelectors.selectCurrentTurnPhaseIndex)
    ),
    tap(([action, approval, turnPhaseIndex]) => {
      if(approval.opponent && approval.player){
        if(turnPhaseIndex === 2){
          this.store.dispatch(GameStateActions.gameGoToNextPhase());
        }
      }
    })
  ), { dispatch: false })
  
  goToNextPhaseResolve$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameGoToNextPhaseResolve),
    withLatestFrom(
      this.store.select(GameSelectors.selectCurrentTurnPhaseIndex),
      this.store.select(GameSelectors.selectFightQueue),
      this.store.select(GameSelectors.selectPlayers),
      this.store.select(GameSelectors.selectCurrentPlayerKey),
    ),
    tap(([action, turnPhaseIndex, fights, players, currentPlayerKey]) => {
      if(turnPhaseIndex === 3){
        const attackingPlayerCards = players[currentPlayerKey].cardsInPlay.filter(card => card.attacking);
        const defendingPlayerId = players[getOtherPlayerKey(currentPlayerKey)].gameObjectId;

        this.gameFightsSvc.resolveFights(fights, attackingPlayerCards, defendingPlayerId);
      }
    })
  ), { dispatch: false })

  gameResolveFightsDamage$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameResolveFightsDamage),
    tap(() => {
      setTimeout(() => {
        this.store.dispatch(GameStateActions.gameResolveFights());
      }, 400);
    })
  ), { dispatch: false })

  gameResolveFights$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameResolveFights),
    withLatestFrom(this.store.select(GameSelectors.selectGame)),
    tap(([action, gameState]) => {
      setTimeout(() => {
        if(gameState.currentPlayerKey === 'opponent'){
          this.store.dispatch(GameStateActions.gameEndTurn());
        } else {
          const cardPlayableCheckPayload = getCardPlayableCheckPayload(gameState, { playerKey: gameState.currentPlayerKey });

          if(getHasPlayableCards(gameState[gameState.currentPlayerKey].hand, cardPlayableCheckPayload)){
            this.store.dispatch(GameStateActions.gameGoToNextPhase());
          } else {
            this.store.dispatch(GameStateActions.gameEndTurn());
          }
        }
      }, 1000);
    })
  ), { dispatch: false })

  endTurn$ = createEffect(() => this.actions$.pipe(
    ofType(
      GameStateActions.gameEndTurn,
      GameStateActions.gameGoToNextPhase,
      GameStateActions.gameGoToPhase
    ),
    withLatestFrom(
      this.store.select(GameSelectors.selectContinuationApproval),
      this.store.select(GameSelectors.selectStateActionsQueue)
    ),
    tap(([action, approval, actionsQueue]) => {
      if(approval.opponent && approval.player && actionsQueue.length){
        this.store.dispatch(actionsQueue[actionsQueue.length - 1]());
      }
    })
  ), { dispatch: false })

  endTurnResolve$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameEndTurnResolve),
    switchMap(() => {
      return of(GameStateActions.gameSetupNextTurn());
    })
  ))

  setupNextTurn$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameSetupNextTurn),
    switchMap(() => {
      return of(GameStateActions.gameStartTurn());
    })
  ))

  startTurn$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameStartTurn),
    withLatestFrom(this.store.select(GameSelectors.selectCurrentPlayerKey)),
    switchMap(([action, playerKey]) => {
      return of(GameEffectActions.gameDrawXCards({ amount: 1, playerKey }));
    })
  ))
}