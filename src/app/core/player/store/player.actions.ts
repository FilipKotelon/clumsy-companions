import { Player } from '@core/player/player.types';
import { Action } from '@ngrx/store';

export const PLAYER_SET = '[Player] Set';

export type PlayerActions = PlayerSet;

export class PlayerSet implements Action {
  readonly type = PLAYER_SET;

  constructor( public payload: Player ) {}
}