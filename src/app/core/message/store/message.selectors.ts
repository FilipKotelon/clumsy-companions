import { createSelector } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as fromMessage from './message.reducer';

export type SelectorType = typeof selectError;

export const selectMsg = (state: fromStore.AppState) => state.message;

export const selectError = createSelector(
  selectMsg,
  (state: fromMessage.State) => state.error
)

export const selectInfo = createSelector(
  selectMsg,
  (state: fromMessage.State) => state.info
)