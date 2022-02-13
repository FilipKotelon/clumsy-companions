import { createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { BuffData, CardInPlay, CompanionBaseStats, ContinuationApproval, CounterPlayStatus, EffectBasePayload, GameActiveEffects, HandCard, InGameCard, InGamePlayer, PlayerKey, TURN_PHASES } from '@core/game/game.types';

import * as GameEffectActions from './game-effect.actions';
import * as GameStateActions from '@core/game/store/game-state.actions';
import { shuffleCards } from '../game.helpers';
import { CardType } from '@core/cards/cards.types';

interface CardPlayableCheckPayload {
  player: InGamePlayer;
  turnPhaseIndex: number;
  hasTurn: boolean;
  canCounter: boolean;
  cardsInQueue: boolean;
}

interface CardPlayableCheckFullPayload extends CardPlayableCheckPayload {
  card: InGameCard;
}

interface PlayerKeyAndCardPayload {
  playerKey: PlayerKey;
  card?: InGameCard;
}

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
    deckSleeveImgUrl: null,
    playedFoodThisTurn: false
  }
}

const getCardPlayableCheckPayload = (draft: State, pcPayload: PlayerKeyAndCardPayload): CardPlayableCheckPayload => {
  const hasTurn = draft.currentPlayerKey === pcPayload.playerKey;
  let canCounter = false;

  if(pcPayload.card && !hasTurn){
    if(pcPayload.card.type !== CardType.Food){
      canCounter = true;
    }
  }

  if(hasTurn && draft.counterPlayStatus.playerKey === draft.currentPlayerKey && draft.counterPlayStatus.canCounter){
    canCounter = true;
  }

  return {
    player: draft[pcPayload.playerKey],
    turnPhaseIndex: draft.turnPhaseIndex,
    hasTurn,
    canCounter,
    cardsInQueue: draft.cardsQueue.length > 0
  }
}

const getIsCardPlayable = (payload: CardPlayableCheckFullPayload): boolean => {
  const { card, player, turnPhaseIndex, hasTurn, canCounter, cardsInQueue } = payload;
  const turnPhase = TURN_PHASES[turnPhaseIndex];
  let cardTypes: CardType[] = [];
  let canPayForCost = false;

  if(!hasTurn){
    if(canCounter){
      cardTypes = [CardType.Trick];
      return cardTypes.includes(card.type);
    } else {
      return false;
    }
  }

  if(cardsInQueue){
    if(canCounter){
      cardTypes = [CardType.Trick];
      return cardTypes.includes(card.type);
    } else {
      return false;
    }
  }

  if(turnPhase.type === 'action'){
    cardTypes = [CardType.Trick];
  } else {
    cardTypes = [CardType.Food, CardType.Charm, CardType.Companion, CardType.Trick];
  }

  if(card.type === CardType.Food){
    return cardTypes.includes(card.type) && !player.playedFoodThisTurn;
  }

  if(card.cost <= player.currentFood){
    canPayForCost = true;
  }

  return cardTypes.includes(card.type) && canPayForCost;
}

const getResetContinuationApproval = (): ContinuationApproval => ({
  player: false,
  opponent: false
});

const getResetCounterPlayStatus = (): CounterPlayStatus => ({
  playerKey: null,
  canCounter: false
});

const getOtherPlayerKey = (playerKey: PlayerKey): PlayerKey => {
  if(playerKey === 'opponent') return 'player';
  return 'opponent';
}

const getHasPlayableCards = (hand: HandCard[], payload: CardPlayableCheckPayload): boolean => {
  return hand.some(card => getIsCardPlayable({ ...payload, card }))
}

const getValuesFromEffect = (effect: EffectBasePayload): CompanionBaseStats => {
  const values: CompanionBaseStats = {
    energy: 0,
    strength: 0
  };

  if(effect.values.main){
    values.energy = effect.values.main;
    values.strength = effect.values.main;
  }

  if(effect.values.energy){
    values.energy = effect.values.energy;
  }

  if(effect.values.energy){
    values.strength = effect.values.strength;
  }

  return values;
}

const pipeCompanion = (card: CardInPlay, activeEffects: GameActiveEffects): CardInPlay => {
  if(card.effectedPersonallyBy && card.effectedPersonallyBy.length){
    card.effectedPersonallyBy.forEach(buff => {
      const values = getValuesFromEffect(buff);

      if(buff.positive){
        card.energy += values.energy;
        card.strength += values.strength;
      } else {
        card.energy -= values.energy;
        card.strength -= values.strength;
      }
    })
  }

  if(activeEffects.auras.length){
    activeEffects.auras.forEach(aura => {
      if((aura.playerKey === card.currentPlayerKey && aura.target === 'allies')
        || (aura.playerKey === card.currentPlayerKey && aura.target === 'allies-except' && aura.originId !== card.gameObjectId)
        || (aura.target === 'all-except' && aura.originId !== card.gameObjectId)
        || (aura.playerKey !== card.currentPlayerKey && aura.target === 'enemies')) {
        const values = getValuesFromEffect(aura);
  
        if(aura.positive){
          card.energy += values.energy;
          card.strength += values.strength;
        } else {
          card.energy -= values.energy;
          card.strength -= values.strength;
        }
      }
    });
  }

  if(activeEffects.buffs.length){
    activeEffects.buffs.forEach(buff => {
      if((buff.playerKey === card.currentPlayerKey && buff.target === 'allies')
        || (buff.playerKey !== card.currentPlayerKey && buff.target === 'enemies')) {
        const values = getValuesFromEffect(buff);
  
        if(buff.positive){
          card.energy += values.energy;
          card.strength += values.strength;
        } else {
          card.energy -= values.energy;
          card.strength -= values.strength;
        }
      }
    });
  }

  return card;
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
  effectsQueue: GameEffectActions.GameEffect[];
  cardsQueue: InGameCard[];
  activeEffects: GameActiveEffects;
  currentPlayerKey: PlayerKey;
  counterPlayStatus: CounterPlayStatus;
  continuationApproval: ContinuationApproval;
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
  currentPlayerKey: null,
  counterPlayStatus: getResetCounterPlayStatus(),
  continuationApproval: getResetContinuationApproval(),
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
      draft.playersHandsChosen = true;
    }
  ),
  immerOn(
    GameStateActions.gameChooseFirstPlayer,
    (draft, action) => {
      draft.currentPlayerKey = action.playerKey;
      draft.firstPlayerChosen = true;

      ['player', 'opponent'].forEach(pKey => {
        const cardPlayableCheckPayload = getCardPlayableCheckPayload(draft, { playerKey: pKey as PlayerKey });
        draft[pKey].hand.push(...draft[pKey].deck.splice(-7).map(card => ({ ...card, playable: getIsCardPlayable({ ...cardPlayableCheckPayload, card }) })));
      });
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

      const cardPlayableCheckPayload = getCardPlayableCheckPayload(draft, action);

      cardPlayableCheckPayload.canCounter = getHasPlayableCards(draft[action.playerKey].hand, cardPlayableCheckPayload);

      if(action.card.type !== CardType.Food){
        draft[action.playerKey].currentFood -= action.card.cost;
        draft.continuationApproval[action.playerKey] = true;
        draft.continuationApproval[getOtherPlayerKey(action.playerKey)] = !cardPlayableCheckPayload.canCounter;

        if(cardPlayableCheckPayload.canCounter){
          draft.counterPlayStatus = {
            playerKey: getOtherPlayerKey(action.playerKey),
            canCounter: cardPlayableCheckPayload.canCounter
          }
        } else {
          draft.counterPlayStatus = getResetCounterPlayStatus();
        }
      }

      if(action.card.type === CardType.Food){
        draft.continuationApproval = { player: true, opponent: true };
      }

      ['player', 'opponent'].forEach(pKey => {
        draft[pKey].hand.forEach(card => {
          card.playable = getIsCardPlayable({
            ...cardPlayableCheckPayload,
            card
          });
        });
      });
    }
  ),
  immerOn(
    GameStateActions.gameResolveCard,
    (draft, action) => {
      switch(action.card.type){
        case CardType.Food:
          draft[action.playerKey].currentFood++;
          draft[action.playerKey].baseFood++;
          draft[action.playerKey].playedFoodThisTurn = true;
          break;
        case CardType.Companion:
          const { playable, ...companion } = action.card;
          draft[action.playerKey].cardsInPlay.push(
            pipeCompanion({
              ...companion,
              dizzy: true,
              attacking: false,
              defending: false
            }, draft.activeEffects)
          );

          if(action.card.effects && action.card.effects.length){
            draft.effectsQueue.push(...action.card.effects.map(effect => effect.action))
          }
          break;
        case CardType.Charm:
        case CardType.Trick:
          if(action.card.effects && action.card.effects.length){
            draft.effectsQueue.push(...action.card.effects.map(effect => effect.action))
          }
          break;
        default:
          break;
      }
    }
  ),
  immerOn(
    GameStateActions.gameResolveCardInQueue,
    (draft, action) => {
      const index = draft.cardsQueue.findIndex(card => card.gameObjectId === action.card.gameObjectId);
      draft.cardsQueue.splice(index, 1);
    }
  ),
  immerOn(
    GameStateActions.gameResolveCardQueue,
    (draft, action) => {
      ['player', 'opponent'].forEach(pKey => {
        const cardPlayableCheckPayload = getCardPlayableCheckPayload(draft, { playerKey: pKey as PlayerKey });

        draft[pKey].hand.forEach(card => {
          card.playable = getIsCardPlayable({
            ...cardPlayableCheckPayload,
            card
          });
        });
      });
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
        const cardPlayableCheckPayload = getCardPlayableCheckPayload(draft, action);
        const drawnCard = draft[action.playerKey].deck.pop();

        draft[action.playerKey].hand.push({
          ...drawnCard,
          playable: getIsCardPlayable({
            ...cardPlayableCheckPayload,
            card: drawnCard
          })
        });
      }
    }
  )
)
