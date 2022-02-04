import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { GameActiveEffects, InGamePlayer } from '@core/game/game.types';

import { GameEffectAction, getGameEffectsMap } from './game.effect.actions';
import * as GameStateActions from '@core/game/store/game.state.actions';

const gameEffectsMap = getGameEffectsMap();

export interface State {
  initialLoading: boolean;
  preparingForGame: boolean;
  gameStarted: boolean;
  player: InGamePlayer;
  opponent: InGamePlayer;
  turn: number;
  turnPhaseIndex: number;
  effectsQueue: GameEffectAction[];
  activeEffects: GameActiveEffects;
}

const gameStateFactory = (data: Partial<State> = {}): State => ({
  initialLoading: false,
  preparingForGame: false,
  gameStarted: false,
  player: null,
  opponent: null,
  turn: 1,
  turnPhaseIndex: 0,
  effectsQueue: [],
  activeEffects: {
    auras: [],
    buffs: []
  },
  ...data
});

export const gameReducer = createReducer(
  gameStateFactory(),
  immerOn(
    GameStateActions.gameLoadStart,
    (draft, action) => {
      draft = gameStateFactory({ initialLoading: true });
    }
  ),
  immerOn(
    GameStateActions.gameLoadPlayers,
    (draft, action) => {
      draft.initialLoading = false;
      draft.preparingForGame = true;
      draft.gameStarted = false;
      draft.player = action.player;
      draft.opponent = action.opponent;
    }
  ),
  immerOn(
    GameStateActions.gameLoadEnd,
    (draft, action) => {
      draft.initialLoading = false;
      draft.preparingForGame = true;
      draft.gameStarted = false;
    }
  )
)
