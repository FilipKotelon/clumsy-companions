import { Action } from '@ngrx/store'

export const APP_ERROR = '[App Msg] Error';
export const APP_ERROR_CLEAR = '[App Msg] ErrorClear';
export const APP_INFO = '[App Msg] Info';
export const APP_INFO_CLEAR = '[App Msg] InfoClear';

export type AppMsgActions = AppError | AppErrorClear | AppInfo | AppInfoClear;
export type AppMsgClearActions = typeof AppErrorClear | typeof AppInfoClear;

export class AppError implements Action {
  readonly type = APP_ERROR;

  constructor( public payload: string ){ }
}

export class AppErrorClear implements Action {
  readonly type = APP_ERROR_CLEAR;
}

export class AppInfo implements Action {
  readonly type = APP_INFO;

  constructor( public payload: string ){ }
}

export class AppInfoClear implements Action {
  readonly type = APP_INFO_CLEAR;
}