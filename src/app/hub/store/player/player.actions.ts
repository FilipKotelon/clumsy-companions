import { Player } from './../../models/player.model'
import { Action } from '@ngrx/store'

export const PLAYER_SET = '[Player] Set';

export type PlayerActions = PlayerSet;

export class PlayerSet implements Action {
  readonly type = PLAYER_SET;

  constructor( public payload: Player ) {}
}