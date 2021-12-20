import { createSelector } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as fromLoading from './loading.reducer';

export const selectLoading = (state: fromStore.AppState) => state.loading

export const selectIsLoading = createSelector(
  selectLoading,
  (loadingState: fromLoading.State) => loadingState.tasks.length > 0
)

export const selectLoadingTasks = createSelector(
  selectLoading,
  (loadingState: fromLoading.State) => loadingState.tasks
)