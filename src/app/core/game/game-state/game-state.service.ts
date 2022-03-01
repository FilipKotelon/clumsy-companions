import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromGame from '@core/game/store/game.reducer';
import * as fromStore from '@core/store/reducer';
import * as GameSelectors from '@core/game/store/game.selectors';
import * as GameStateActions from '@core/game/store/game-state.actions';
import { GameEffect } from '@core/game/store/game-effect.actions';

import { ContinuationApproval, CounterPlayStatus, GameGiftData, InGameCard, PlayerKey, PlayerOpponentLoadInfo, TurnPhaseName } from '../game.types';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  cardPlayed$ = new Subject<number>();

  constructor(
    private store: Store<fromStore.AppState>
  ) { }

  endGame = (): void => {
    this.store.dispatch(GameStateActions.gameEnd());
  }

  getGameState = (): Observable<fromGame.State> => {
    return this.store.select(GameSelectors.selectGame);
  }

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

  getEffectsQueue = (): Observable<GameEffect[]> => {
    return this.store.select(GameSelectors.selectEffectsQueue);
  }

  getCounterPlayStatus = (): Observable<CounterPlayStatus> => {
    return this.store.select(GameSelectors.selectCounterPlayStatus);
  }

  getContinuationApproval = (): Observable<ContinuationApproval> => {
    return this.store.select(GameSelectors.selectContinuationApproval);
  }

  getTransitioning = (): Observable<boolean> => {
    return this.store.select(GameSelectors.selectTransitioning);
  }

  getWinner = (): Observable<PlayerKey> => {
    return this.store.select(GameSelectors.selectGameWinner);
  }

  getMaxReward = (): Observable<GameGiftData> => {
    return this.store.select(GameSelectors.selectMaxReward);
  }

  choosePlayerHands = (): void => {
    this.store.dispatch(GameStateActions.gameChoosePlayersHands());
  }

  chooseFirstPlayer = (playerKey: PlayerKey): void => {
    this.store.dispatch(GameStateActions.gameChooseFirstPlayer({ playerKey }));
  }

  endTurn = (): void => {
    this.store.dispatch(GameStateActions.gameEndTurn());
  }

  goToNextPhase = (): void => {
    this.store.dispatch(GameStateActions.gameGoToNextPhase());
  }

  goToPhase = (phaseName: TurnPhaseName): void => {
    this.store.dispatch(GameStateActions.gameGoToPhase({ phaseName }));
  }
}
