import { Player } from '@core/player/player.types';
import { Action } from '@ngrx/store';

export const SET_PLAYER = '[Player] Set';

export type PlayerActions = SetPlayer;

export class SetPlayer implements Action {
  readonly type = SET_PLAYER;

  constructor( public payload: Player ) {}
}