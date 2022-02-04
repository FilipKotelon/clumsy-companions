import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '@core/auth/store/auth.reducer';
import * as fromGame from '@core/game/store/game.reducer';
import * as fromLoading from '@core/loading/store/loading.reducer';
import * as fromMessage from '@core/message/store/message.reducer';
import * as fromPlayer from '@core/player/store/player.reducer';

export interface AppState {
  auth: fromAuth.State,
  game: fromGame.State,
  loading: fromLoading.State
  message: fromMessage.State,
  player: fromPlayer.State
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  game: fromGame.gameReducer,
  loading: fromLoading.appLoadingReducer,
  message: fromMessage.messageReducer,
  player: fromPlayer.playerReducer,
}