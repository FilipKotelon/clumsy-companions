import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { GameConnectorService } from '@core/game/game-connector/game-connector.service';
import * as GameStateActions from '@core/game/store/game.state.actions';
import * as fromStore from '@core/store/reducer';

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
}