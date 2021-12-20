import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '@core/auth/store/auth.reducer';
import * as fromMessage from '@core/message/store/message.reducer';
import * as fromLoading from '@core/loading/store/loading.reducer';
import * as fromPlayer from '@core/player/store/player.reducer';

export interface AppState {
  auth: fromAuth.State,
  loading: fromLoading.State
  message: fromMessage.State,
  player: fromPlayer.State
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  loading: fromLoading.appLoadingReducer,
  message: fromMessage.messageReducer,
  player: fromPlayer.playerReducer,
}