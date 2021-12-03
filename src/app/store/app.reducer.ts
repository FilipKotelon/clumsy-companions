import { ActionReducerMap } from '@ngrx/store'

import * as fromAuth from '@auth/store/auth.reducer'
import * as fromAppMsg from './app-msg.reducer'

export interface AppState {
  auth: fromAuth.State,
  msg: fromAppMsg.State
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  msg: fromAppMsg.appMsgReducer
}