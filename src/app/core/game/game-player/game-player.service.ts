import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as GameEffectActions from '@core/game/store/game.effect.actions';
import { InGameCard, PlayerKey } from '../game.types';

@Injectable({
  providedIn: 'root'
})
export class GamePlayerService {

  constructor(private store: Store<fromStore.AppState>) { }

  drawXCards = (x: number, playerKey: PlayerKey): void => {
    this.store.dispatch(GameEffectActions.gameDrawXCards({ amount: x, playerKey }));
  }

  shuffleDeck = (playerKey: PlayerKey): void => {
    this.store.dispatch(GameEffectActions.gameShuffleDeck({ playerKey }));
  }
}
