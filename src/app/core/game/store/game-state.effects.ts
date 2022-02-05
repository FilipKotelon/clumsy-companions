import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { GameConnectorService } from '@core/game/game-connector/game-connector.service';
import * as GameStateActions from '@core/game/store/game.state.actions';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class GameStateEffects {
  constructor(
    private actions$: Actions,
    private gameConnectorSvc: GameConnectorService,
    private router: Router
  ) {}

  loadStart$ = createEffect(() => this.actions$.pipe(
    ofType(GameStateActions.gameLoadStart),
    switchMap(({ type, ...data }) => {
      this.router.navigate(['/game/']);

      return this.gameConnectorSvc.loadPlayers(data);
    })
  ))
}