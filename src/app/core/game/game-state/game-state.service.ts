import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as GameSelectors from '@core/game/store/game.selectors';
import * as GameStateActions from '@core/game/store/game.state.actions';

import { PlayerOpponentLoadInfo } from '../game.types';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  constructor(
    private store: Store<fromStore.AppState>
  ) { }

  getPlayers = (): Observable<PlayerOpponentLoadInfo> => {
    return this.store.select(GameSelectors.selectPlayers);
  }

  getIsPreparing = (): Observable<boolean> => {
    return this.store.select(GameSelectors.selectIsPreparing);
  }

  getArePlayersHandsChosen = (): Observable<boolean> => {
    return this.store.select(GameSelectors.selectArePlayersHandsChosen);
  }

  getIsFirstPlayerChosen = (): Observable<boolean> => {
    return this.store.select(GameSelectors.selectIsFirstPlayerChosen);
  }

  choosePlayerHands = (): void => {
    this.store.dispatch(GameStateActions.gameChoosePlayersHands());
  }
}