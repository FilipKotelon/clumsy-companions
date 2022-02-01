import { createAction, props } from '@ngrx/store';
import { GameStartData } from '../game.types';

/* Actions changing the state of the game, like starting the game, ending, switching turns, phases */

export enum GameStateActionType {
  START = '[Game] Start',
  END = '[Game] End',
  LOAD_START = '[Game] Load Start',
  LOAD_END = '[Game] Load End'
}

export const gameStart = createAction(GameStateActionType.START);

export const gameEnd = createAction(GameStateActionType.END);

export const gameLoadStart = createAction(GameStateActionType.LOAD_START);

export const gameLoadEnd = createAction(
  GameStateActionType.LOAD_END,
  props<GameStartData>()
);
