import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as GameSelectors from '@core/game/store/game.selectors';
import * as GameStateActions from '@core/game/store/game-state.actions';

import { ContinuationApproval, CounterPlayStatus, InGameCard, PlayerKey, PlayerOpponentLoadInfo } from '../game.types';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  cardPlayed$ = new Subject<number>();

  constructor(
    private store: Store<fromStore.AppState>
  ) { }

  getPlayers = (): Observable<PlayerOpponentLoadInfo> => {
    return this.store.select(GameSelectors.selectPlayers);
  }

  getCurrentPlayerKey = (): Observable<PlayerKey> => {
    return this.store.select(GameSelectors.selectCurrentPlayerKey);
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

  getCurrentTurnPhaseIndex = (): Observable<number> => {
    return this.store.select(GameSelectors.selectCurrentTurnPhaseIndex);
  }

  getCardsQueue = (): Observable<InGameCard[]> => {
    return this.store.select(GameSelectors.selectCardsQueue);
  }

  getCounterPlayStatus = (): Observable<CounterPlayStatus> => {
    return this.store.select(GameSelectors.selectCounterPlayStatus);
  }

  getContinuationApproval = (): Observable<ContinuationApproval> => {
    return this.store.select(GameSelectors.selectContinuationApproval);
  }

  choosePlayerHands = (): void => {
    this.store.dispatch(GameStateActions.gameChoosePlayersHands());
  }

  chooseFirstPlayer = (playerKey: PlayerKey): void => {
    this.store.dispatch(GameStateActions.gameChooseFirstPlayer({ playerKey }));
  }
}
