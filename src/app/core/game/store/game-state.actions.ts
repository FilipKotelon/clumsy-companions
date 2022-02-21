import { createAction, props } from '@ngrx/store';
import { GameStartRawData, HandCard, PlayerKey, PlayerOpponentBundle, TurnPhaseName } from '../game.types';

/* Actions changing the state of the game, like starting the game, ending, switching turns, phases */

export enum GameStateActionType {
  START = '[Game] Start',
  END = '[Game] End',
  LOAD_START = '[Game] Load Start',
  LOAD_PLAYERS = '[Game] Load Players',
  LOAD_END = '[Game] Load End',
  CHOOSE_HANDS = '[Game] Choose Hands',
  CHOOSE_FIRST_PLAYER = '[Game] Choose First Player',
  PLAY_CARD = '[Game] Play Card',
  RESOLVE_CARD = '[Game] Resolve Card',
  RESOLVE_CARD_IN_QUEUE = '[Game] Resolve Card In Queue',
  APPROVE_CONTINUATION = '[Game] Approve Continuation',
  END_TURN = '[Game] End Turn',
  END_TURN_RESOLVE = '[Game] End Turn Resolve',
  GO_TO_NEXT_PHASE = '[Game] Go To Next Phase',
  GO_TO_NEXT_PHASE_RESOLVE = '[Game] Go To Next Phase Resolve',
  GO_TO_PHASE = '[Game] Go To Phase',
  GO_TO_PHASE_RESOLVE = '[Game] Go To Phase Resolve',
  SETUP_NEXT_TURN = '[Game] Setup Next Turn',
  START_TURN = '[Game] Start Turn'
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

export const gamePlayCard = createAction(
  GameStateActionType.PLAY_CARD,
  props<{ card: HandCard, playerKey: PlayerKey }>()
);

export const gameResolveCard = createAction(
  GameStateActionType.RESOLVE_CARD,
  props<{ card: HandCard, playerKey: PlayerKey }>()
);

export const gameResolveCardInQueue = createAction(
  GameStateActionType.RESOLVE_CARD_IN_QUEUE,
  props<{ card: HandCard }>()
);

export const gameApproveContinuation = createAction(
  GameStateActionType.APPROVE_CONTINUATION,
  props<{ playerKey: PlayerKey }>()
);

export const gameEndTurn = createAction(
  GameStateActionType.END_TURN
);

export const gameEndTurnResolve = createAction(
  GameStateActionType.END_TURN_RESOLVE
);

export const gameGoToNextPhase = createAction(
  GameStateActionType.GO_TO_NEXT_PHASE
);

export const gameGoToNextPhaseResolve = createAction(
  GameStateActionType.GO_TO_NEXT_PHASE_RESOLVE
);

export const gameGoToPhase = createAction(
  GameStateActionType.GO_TO_PHASE,
  props<{ phaseName: TurnPhaseName }>()
);

export const gameGoToPhaseResolve = createAction(
  GameStateActionType.GO_TO_PHASE_RESOLVE,
  props<{ phaseName: TurnPhaseName }>()
);

export const gameSetupNextTurn = createAction(
  GameStateActionType.SETUP_NEXT_TURN
);

export const gameStartTurn = createAction(
  GameStateActionType.START_TURN
);
