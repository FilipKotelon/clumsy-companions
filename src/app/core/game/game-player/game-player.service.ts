import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as GameEffectActions from '@core/game/store/game-effect.actions';
import * as GameStateActions from '@core/game/store/game-state.actions';
import { HandCard, PlayerKey } from '../game.types';

@Injectable({
  providedIn: 'root'
})
export class GamePlayerService {
  constructor(private store: Store<fromStore.AppState>) { }

  approveContinuation = (playerKey: PlayerKey): void => {
    this.store.dispatch(GameStateActions.gameApproveContinuation({ playerKey }));
  }

  drawXCards = (x: number, playerKey: PlayerKey): void => {
    this.store.dispatch(GameEffectActions.gameDrawXCards({ amount: x, playerKey }));
  }
  
  playCard = (card: HandCard, playerKey: PlayerKey): void => {
    this.store.dispatch(GameStateActions.gamePlayCard({ card, playerKey }));
  }

  shuffleDeck = (playerKey: PlayerKey): void => {
    this.store.dispatch(GameEffectActions.gameShuffleDeck({ playerKey }));
  }
}
