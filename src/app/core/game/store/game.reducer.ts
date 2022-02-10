import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { GameActiveEffects, InGameCard, InGamePlayer } from '@core/game/game.types';

import * as GameEffectActions from './game-effect.actions';
import * as GameStateActions from '@core/game/store/game-state.actions';
import { shuffleCards } from '../game.helpers';
import { CardType } from '@core/cards/cards.types';

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
  cardsQueue: InGameCard[];
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
  cardsQueue: [],
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
      const cleanState = gameStateFactory();

      Object.keys(cleanState).forEach(key => {
        draft[key] = cleanState[key];
      })
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
    GameStateActions.gameChooseFirstPlayer,
    (draft, action) => {
      draft.firstPlayerChosen = true;
    }
  ),
  immerOn(
    GameStateActions.gameStart,
    (draft, action) => {
      draft.preparingForGame = false;
      draft.gameStarted = true;
    }
  ),
  immerOn(
    GameStateActions.gamePlayCard,
    (draft, action) => {
      draft.cardsQueue.push(
        ...draft[action.playerKey].hand.splice(
          draft[action.playerKey].hand.findIndex(card => card.gameObjectId === action.card.gameObjectId),
          1
        )
      );
    }
  ),
  immerOn(
    GameStateActions.gameResolveFood,
    (draft, action) => {
      draft[action.playerKey].baseFood += action.amount;
      draft[action.playerKey].currentFood += action.amount;
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
