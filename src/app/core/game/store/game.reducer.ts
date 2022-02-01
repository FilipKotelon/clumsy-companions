import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { GameActiveEffects, InGamePlayer } from '@core/game/game.types';

import { GameEffectAction, GAME_EFFECTS_MAP } from './game.effect.actions';
import * as GameStateActions from '@core/game/store/game.state.actions';

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
    GameStateActions.gameLoadEnd,
    (draft, action) => {
      draft.initialLoading = false;
      draft.preparingForGame = true;
      draft.gameStarted = false;
      draft.player = action.player;
      draft.opponent = action.opponent;
    }
  )
)

// export function authReducer ( state = initState, action: AuthActions.AuthActions ): State {
//   switch(action.type){

//     case AuthActions.AUTH_SUCCESS :
//       return {
//         ...state,
//         user: action.payload.user
//       }
      
//     case AuthActions.LOGOUT :
//       return {
//         ...state,
//         user: null
//       }

//     case AuthActions.REFRESH_TOKEN :
//       const user = new User(
//         state.user.email,
//         state.user.id,
//         state.user.dbId,
//         state.user.role,
//         action.payload.token,
//         action.payload.expirationTime
//       );

//       return {
//         ...state,
//         user
//       }

//     default:
//       return state;
      
//   }
// }