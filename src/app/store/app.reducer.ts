import { ActionReducerMap } from '@ngrx/store'

import * as fromAuth from '@auth/store/auth.reducer'
import * as fromAppMsg from './msg/app-msg.reducer'
import * as fromAppLoading from './loading/app-loading.reducer'
import * as fromPlayer from '@hub/store/player/player.reducer';

export interface AppState {
  auth: fromAuth.State,
  loading: fromAppLoading.State
  msg: fromAppMsg.State,
  player: fromPlayer.State
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  loading: fromAppLoading.appLoadingReducer,
  msg: fromAppMsg.appMsgReducer,
  player: fromPlayer.playerReducer,
}