import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as GameEffectActions from '@core/game/store/game.effect.actions';
import { PlayerKey } from '../game.types';

@Injectable({
  providedIn: 'root'
})
export class GamePlayerService {

  constructor(private store: Store<fromStore.AppState>) { }

  shuffleDeck = (playerKey: PlayerKey): void => {
    this.store.dispatch(GameEffectActions.gameShuffleDeck({ playerKey }));
  }
}
