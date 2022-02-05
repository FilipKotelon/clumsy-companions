import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { GameActiveEffects, InGamePlayer } from '@core/game/game.types';

import * as GameEffectActions from './game.effect.actions';
import * as GameStateActions from '@core/game/store/game.state.actions';
import { shuffleCards } from '../game.helpers';

const getEmptyPlayer = (): InGamePlayer => {
  return {
    baseFood: null,
    hand: [],
    sleepyard: [],
    cardsInPlay: [],
    energy: null,
    currentFood: null,
    hasTurn: null,
    avatarImgUrl: null,
    gameObjectId: null,
    username: null,
    deck: [],
    deckSleeveImgUrl: null
  }
}

export interface State {
  initialLoading: boolean;
  playersLoaded: boolean;
  preparingForGame: boolean;
  playersHandsChosen: boolean;
  firstPlayerChosen: boolean;
  gameStarted: boolean;
  player: InGamePlayer;
  opponent: InGamePlayer;
  turn: number;
  turnPhaseIndex: number;
  effectsQueue: GameEffectActions.GameEffectAction[];
  activeEffects: GameActiveEffects;
}

const gameStateFactory = (data: Partial<State> = {}): State => ({
  initialLoading: true,
  playersLoaded: false,
  preparingForGame: false,
  playersHandsChosen: false,
  firstPlayerChosen: false,
  gameStarted: false,
  player: getEmptyPlayer(),
  opponent: getEmptyPlayer(),
  turn: 1,
  turnPhaseIndex: 0,
  effectsQueue: [],
  activeEffects: {
    auras: [],
    buffs: []
  },
  ...data
});

export const gameReducer = createReducer(
  gameStateFactory(),
  immerOn(
    GameStateActions.gameLoadStart,
    (draft, action) => {
      draft = gameStateFactory();
    }
  ),
  immerOn(
    GameStateActions.gameLoadPlayers,
    (draft, action) => {
      draft.playersLoaded = true;
      draft.player = action.player;
      draft.opponent = action.opponent;
    }
  ),
  immerOn(
    GameStateActions.gameLoadEnd,
    (draft, action) => {
      draft.initialLoading = false;
      draft.preparingForGame = true;
    }
  ),
  immerOn(
    GameStateActions.gameChoosePlayersHands,
    (draft, action) => {
      draft.player.hand.push(...draft.player.deck.splice(-7));
      draft.opponent.hand.push(...draft.opponent.deck.splice(-7));

      draft.playersHandsChosen = true;
    }
  ),

  immerOn(
    GameEffectActions.gameShuffleDeck,
    (draft, action) => {
      draft[action.playerKey].deck = shuffleCards(draft[action.playerKey].deck);
    }
  ),
  immerOn(
    GameEffectActions.gameDrawXCards,
    (draft, action) => {
      for(let i = 0; i < action.amount; i++){
        draft[action.playerKey].hand.push(draft[action.playerKey].deck.pop());
      }
    }
  )
)