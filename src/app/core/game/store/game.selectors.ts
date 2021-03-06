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

export const selectCurrentPlayerKey = createSelector(
  selectGame,
  (state: fromGame.State) => state.currentPlayerKey
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

export const selectCardsQueue = createSelector(
  selectGame,
  (state: fromGame.State) => state.cardsQueue
);

export const selectCounterPlayStatus = createSelector(
  selectGame,
  (state: fromGame.State) => state.counterPlayStatus
);

export const selectContinuationApproval = createSelector(
  selectGame,
  (state: fromGame.State) => state.continuationApproval
);

export const selectStateActionsQueue = createSelector(
  selectGame,
  (state: fromGame.State) => state.stateActionsQueue
);

export const selectEffectsQueue = createSelector(
  selectGame,
  (state: fromGame.State) => state.effectsQueue
);

export const selectFightQueue = createSelector(
  selectGame,
  (state: fromGame.State) => state.fightQueue
);

export const selectTransitioning = createSelector(
  selectGame,
  (state: fromGame.State) => state.transitioning
);

export const selectGameEndedByDraw = createSelector(
  selectGame,
  (state: fromGame.State) => state.gameEndedByDraw
);

export const selectGameWinner = createSelector(
  selectGame,
  (state: fromGame.State) => state.winner
);

export const selectMaxReward = createSelector(
  selectGame,
  (state: fromGame.State) => state.winMaxReward
);
