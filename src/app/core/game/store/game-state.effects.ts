import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { map } from '@firebase/util';
import { of } from 'rxjs';

import { GameConnectorService } from '@core/game/game-connector/game-connector.service';

import * as GameStateActions from '@core/game/store/game-state.actions';
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
      console.log(approval);
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

  resolveCardInQueue$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameResolveCardInQueue),
    withLatestFrom(this.store.select(GameSelectors.selectCardsQueue)),
    tap(([{ type, ...payload }, cardsQueue]) => {
      if(!cardsQueue.length){
        this.store.dispatch(GameStateActions.gameResolveCardQueue());
      }
    })
  ), { dispatch: false })
}