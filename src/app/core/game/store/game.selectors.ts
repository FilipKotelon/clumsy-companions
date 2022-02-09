import * as fromStore from '@core/store/reducer';
import { createSelector } from '@ngrx/store';
import { PlayerOpponentLoadInfo } from '../game.types';
import * as fromGame from './game.reducer';

export const selectGame = (state: fromStore.AppState) => state.game;

export const selectPlayers = createSelector<fromStore.AppState, fromGame.State, PlayerOpponentLoadInfo>(
  selectGame,
  (state: fromGame.State) => ({ player: state.player, opponent: state.opponent, loaded: state.playersLoaded })
);

export const selectPlayer = createSelector(
  selectGame,
  (state: fromGame.State) => state.player
);

export const selectOpponent = createSelector(
  selectGame,
  (state: fromGame.State) => state.opponent
);

export const selectIsLoaded = createSelector(
  selectGame,
  (state: fromGame.State) => !state.initialLoading
);

export const selectIsPreparing = createSelector(
  selectGame,
  (state: fromGame.State) => state.preparingForGame
);

export const selectArePlayersHandsChosen = createSelector(
  selectGame,
  (state: fromGame.State) => state.playersHandsChosen
);

export const selectIsFirstPlayerChosen = createSelector(
  selectGame,
  (state: fromGame.State) => state.firstPlayerChosen
);

export const selectCurrentTurnPhaseIndex = createSelector(
  selectGame,
  (state: fromGame.State) => state.turnPhaseIndex
);
