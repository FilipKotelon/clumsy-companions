import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { map } from '@firebase/util';
import { of } from 'rxjs';

import { GameConnectorService } from '@core/game/game-connector/game-connector.service';

import * as GameStateActions from '@core/game/store/game-state.actions';
import * as GameEffectActions from '@core/game/store/game-effect.actions';
import * as fromStore from '@core/store/reducer';
import * as GameSelectors from '@core/game/store/game.selectors';

@Injectable()
export class GameStateEffects {
  constructor(
    private actions$: Actions,
    private gameConnectorSvc: GameConnectorService,
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
    tap(({ type, ...payload }) => {
      this.store.dispatch(GameStateActions.gameResolveCardInQueue({ card: payload.card }));
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