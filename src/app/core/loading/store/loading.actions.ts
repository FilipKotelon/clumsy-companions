import { Action } from '@ngrx/store';
import { LoadingTask } from '@core/loading/loading.types';

export const LOADING_ADD = '[App Loading] Add';
export const LOADING_REMOVE = '[App Loading] Remove';
export const LOADING_CLEAR = '[App Loading] Clear';

export type LoadingActions = AppLoadingAdd | AppLoadingRemove | AppLoadingClear;

export class AppLoadingAdd implements Action {
  readonly type = LOADING_ADD;

  constructor( public payload: LoadingTask ){ }
}

export class AppLoadingRemove implements Action {
  readonly type = LOADING_REMOVE;

  constructor( public payload: LoadingTask ){ }
}

export class AppLoadingClear implements Action {
  readonly type = LOADING_CLEAR;
}