import { createAction, props } from '@ngrx/store';
import { GameStartRawData, PlayerKey, PlayerOpponentBundle } from '../game.types';

/* Actions changing the state of the game, like starting the game, ending, switching turns, phases */

export enum GameStateActionType {
  START = '[Game] Start',
  END = '[Game] End',
  LOAD_START = '[Game] Load Start',
  LOAD_PLAYERS = '[Game] Load Players',
  LOAD_END = '[Game] Load End',
  CHOOSE_HANDS = '[Game] Choose Hands',
  CHOOSE_FIRST_PLAYER = '[Game] Choose First Player',
}

export const gameStart = createAction(GameStateActionType.START);

export const gameEnd = createAction(GameStateActionType.END);

export const gameLoadStart = createAction(
  GameStateActionType.LOAD_START,
  props<GameStartRawData>()
);

export const gameLoadPlayers = createAction(
  GameStateActionType.LOAD_PLAYERS,
  props<PlayerOpponentBundle>()
);

export const gameLoadEnd = createAction(
  GameStateActionType.LOAD_END
);

export const gameChoosePlayersHands = createAction(
  GameStateActionType.CHOOSE_HANDS
);

export const gameChooseFirstPlayer = createAction(
  GameStateActionType.CHOOSE_FIRST_PLAYER,
  props<{ playerKey: PlayerKey }>()
);
