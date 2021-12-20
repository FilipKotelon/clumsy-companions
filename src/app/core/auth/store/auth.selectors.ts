import { createSelector } from '@ngrx/store';

import * as fromAuth from './auth.reducer';
import * as fromStore from '@core/store/reducer';

export const selectAuth = (state: fromStore.AppState) => state.auth;

export const selectUser = createSelector(
  selectAuth,
  (state: fromAuth.State) => state.user
)