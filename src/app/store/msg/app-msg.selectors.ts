import { createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer'
import * as fromAppMsg from './app-msg.reducer'

export type SelectorType = typeof selectError;

export const selectMsg = (state: fromApp.AppState) => state.msg;

export const selectError = createSelector(
  selectMsg,
  (state: fromAppMsg.State) => state.error
)

export const selectInfo = createSelector(
  selectMsg,
  (state: fromAppMsg.State) => state.info
)