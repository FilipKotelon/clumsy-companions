import { createSelector } from '@ngrx/store'

import * as fromAuth from './auth.reducer'
import * as fromApp from '@app/store/app.reducer'

export const selectAuth = (state: fromApp.AppState) => state.auth;

export const selectUser = createSelector(
  selectAuth,
  (state: fromAuth.State) => state.user
)