import * as fromStore from '@core/store/reducer';
import { createSelector } from '@ngrx/store';
import { PlayerOpponentBundle } from '../game.types';
import * as fromGame from './game.reducer';

export const selectGame = (state: fromStore.AppState) => state.game;

export const selectPlayers = createSelector<fromStore.AppState, fromGame.State, PlayerOpponentBundle>(
  selectGame,
  (state: fromGame.State) => ({ player: state.player, opponent: state.opponent })
)
