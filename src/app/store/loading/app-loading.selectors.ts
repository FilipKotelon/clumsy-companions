import { createSelector } from '@ngrx/store'

import * as fromApp from '../app.reducer';
import * as fromAppLoading from './app-loading.reducer';

export const selectLoading = (state: fromApp.AppState) => state.loading

export const selectIsLoading = createSelector(
  selectLoading,
  (loadingState: fromAppLoading.State) => loadingState.tasks.length > 0
)

export const selectLoadingTasks = createSelector(
  selectLoading,
  (loadingState: fromAppLoading.State) => loadingState.tasks
)