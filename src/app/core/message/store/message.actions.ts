import { Action } from '@ngrx/store';

export const ERROR = '[App Msg] Error';
export const ERROR_CLEAR = '[App Msg] ErrorClear';
export const INFO = '[App Msg] Info';
export const INFO_CLEAR = '[App Msg] InfoClear';

export type MessageActions = Error | ErrorClear | Info | InfoClear;
export type MessageClearActions = ErrorClear | InfoClear;

export class Error implements Action {
  readonly type = ERROR;

  constructor( public payload: string ){ }
}

export class ErrorClear implements Action {
  readonly type = ERROR_CLEAR;
}

export class Info implements Action {
  readonly type = INFO;

  constructor( public payload: string ){ }
}

export class InfoClear implements Action {
  readonly type = INFO_CLEAR;
}