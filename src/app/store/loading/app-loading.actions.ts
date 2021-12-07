import { Action } from '@ngrx/store'
import { AppTask } from './app-loading.reducer';

export const APP_LOADING_ADD = '[App Loading] Add';
export const APP_LOADING_REMOVE = '[App Loading] Remove';
export const APP_LOADING_CLEAR = '[App Loading] Clear';

export type AppLoadingActions = AppLoadingAdd | AppLoadingRemove | AppLoadingClear;

export class AppLoadingAdd implements Action {
  readonly type = APP_LOADING_ADD;

  constructor( public payload: AppTask ){ }
}

export class AppLoadingRemove implements Action {
  readonly type = APP_LOADING_REMOVE;

  constructor( public payload: AppTask ){ }
}

export class AppLoadingClear implements Action {
  readonly type = APP_LOADING_CLEAR;
}