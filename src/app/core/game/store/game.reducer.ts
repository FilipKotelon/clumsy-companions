import { ActionCreator, createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { CardFight, ContinuationApproval, CounterPlayStatus, EffectPayloadType, GameActiveEffects, InGameCard, InGamePlayer, PlayerKey, TURN_PHASES } from '@core/game/game.types';

import * as GameEffectActions from './game-effect.actions';
import * as GameStateActions from '@core/game/store/game-state.actions';
import { getCardPlayableCheckPayload, getEmptyPlayer, getHasPlayableCards, getIsCardPlayable, getOtherPlayerKey, getResetContinuationApproval, getResetCounterPlayStatus, shuffleCards, pipeCompanion } from '../game.helpers';
import { CardType } from '@core/cards/cards.types';
import { TypedAction } from '@ngrx/store/src/models';

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
  stateActionsQueue: ActionCreator<GameStateActions.GameStateActionType, () => TypedAction<GameStateActions.GameStateActionType>>[];
  effectsQueue: GameEffectActions.GameEffect[];
  cardsQueue: InGameCard[];
  fightQueue: CardFight[];
  activeEffects: GameActiveEffects;
  currentPlayerKey: PlayerKey;
  counterPlayStatus: CounterPlayStatus;
  continuationApproval: ContinuationApproval;
  transitioning: boolean;
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
  stateActionsQueue: [],
  effectsQueue: [],
  cardsQueue: [],
  fightQueue: [],
  activeEffects: {
    auras: [],
    buffs: []
  },
  currentPlayerKey: null,
  counterPlayStatus: getResetCounterPlayStatus(),
  continuationApproval: getResetContinuationApproval(),
  transitioning: false,
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
      });
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
            pipeCompanion(
              {
                ...companion,
                dizzy: true,
                attacking: false,
                defending: false
              },
              draft.activeEffects
            )
          );
        case CardType.Charm:
        case CardType.Trick:
          if(action.card.effects && action.card.effects.length){
            action.card.effects.forEach(effect => {
              const payload: Partial<EffectPayloadType> = {};

              if([GameEffectActions.GameEffectActionType.ADD_FOOD,
                GameEffectActions.GameEffectActionType.HEAL_PLAYER,
                GameEffectActions.GameEffectActionType.DAMAGE_ALL,
                GameEffectActions.GameEffectActionType.DAMAGE_ENEMIES,
                GameEffectActions.GameEffectActionType.DAMAGE_TARGET].includes(effect.action.type)){
                payload.amount = effect.values.main;
              }

              if([GameEffectActions.GameEffectActionType.BUFF_TARGET,
                GameEffectActions.GameEffectActionType.BUFF_ALLIES,
                GameEffectActions.GameEffectActionType.DEBUFF_TARGET,
                GameEffectActions.GameEffectActionType.DEBUFF_ENEMIES,
                GameEffectActions.GameEffectActionType.AURA_BUFF_ALLIES,
                GameEffectActions.GameEffectActionType.AURA_BUFF_ALLIES_EXCEPT,
                GameEffectActions.GameEffectActionType.AURA_DEBUFF_ENEMIES,
                GameEffectActions.GameEffectActionType.AURA_DEBUFF_ALL_EXCEPT,
                GameEffectActions.GameEffectActionType.DRAW_X_CARDS,
                GameEffectActions.GameEffectActionType.SHUFFLE_DECK,
                GameEffectActions.GameEffectActionType.HEAL_PLAYER,
                GameEffectActions.GameEffectActionType.ADD_FOOD].includes(effect.action.type)){
                payload.playerKey = action.card.playerKey;
              }

              if([GameEffectActions.GameEffectActionType.BUFF_TARGET,
                GameEffectActions.GameEffectActionType.BUFF_ALLIES,
                GameEffectActions.GameEffectActionType.DEBUFF_TARGET,
                GameEffectActions.GameEffectActionType.DEBUFF_ENEMIES,
                GameEffectActions.GameEffectActionType.AURA_BUFF_ALLIES,
                GameEffectActions.GameEffectActionType.AURA_BUFF_ALLIES_EXCEPT,
                GameEffectActions.GameEffectActionType.AURA_DEBUFF_ENEMIES,
                GameEffectActions.GameEffectActionType.AURA_DEBUFF_ALL_EXCEPT].includes(effect.action.type)){
                payload.values = effect.values;
              }

              if([GameEffectActions.GameEffectActionType.AURA_BUFF_ALLIES,
                GameEffectActions.GameEffectActionType.AURA_BUFF_ALLIES_EXCEPT,
                GameEffectActions.GameEffectActionType.AURA_DEBUFF_ENEMIES,
                GameEffectActions.GameEffectActionType.AURA_DEBUFF_ALL_EXCEPT].includes(effect.action.type)){
                payload.originId = action.card.gameObjectId;
              }

              draft.effectsQueue.push({
                ...effect.action,
                payload
              });
            });
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

      if(!draft.cardsQueue.length){
        ['player', 'opponent'].forEach(pKey => {
          const cardPlayableCheckPayload = getCardPlayableCheckPayload(draft, { playerKey: pKey as PlayerKey });
  
          draft[pKey as PlayerKey].hand.forEach(card => {
            card.playable = getIsCardPlayable({
              ...cardPlayableCheckPayload,
              card
            });
          });
        });
      }
    }
  ),

  immerOn(
    GameStateActions.gameApproveContinuation,
    (draft, action) => {
      draft.continuationApproval[action.playerKey] = true;
    }
  ),
  immerOn(
    GameStateActions.gameEndTurn,
    GameStateActions.gameGoToNextPhase,
    GameStateActions.gameGoToPhase,
    (draft, action) => {
      const otherPlayerKey = getOtherPlayerKey(draft.currentPlayerKey);
      const cardPlayableCheckPayload = getCardPlayableCheckPayload(draft, { playerKey: otherPlayerKey });

      draft.continuationApproval[draft.currentPlayerKey] = true;
      draft.continuationApproval[otherPlayerKey] = otherPlayerKey === 'opponent'
        || !getHasPlayableCards(draft[otherPlayerKey].hand, cardPlayableCheckPayload);
    }
  ),
  immerOn(
    GameStateActions.gameEndTurn,
    (draft, action) => {
      draft.stateActionsQueue.push(GameStateActions.gameEndTurnResolve);
    }
  ),
  immerOn(
    GameStateActions.gameEndTurnResolve,
    (draft, action) => {
      draft.transitioning = true;
    }
  ),
  immerOn(
    GameStateActions.gameGoToNextPhase,
    (draft, action) => {
      draft.stateActionsQueue.push(GameStateActions.gameGoToNextPhaseResolve);
    }
  ),
  immerOn(
    GameStateActions.gameGoToNextPhaseResolve,
    (draft, action) => {
      draft.turnPhaseIndex++;
    }
  ),
  immerOn(
    GameStateActions.gameGoToPhase,
    (draft, action) => {
      draft.stateActionsQueue.push(GameStateActions.gameGoToPhaseResolve.bind(null, { phaseName: action.phaseName }));
    }
  ),
  immerOn(
    GameStateActions.gameGoToPhaseResolve,
    (draft, action) => {
      draft.turnPhaseIndex = TURN_PHASES.findIndex(phase => phase.name === action.phaseName);
    }
  ),
  immerOn(
    GameStateActions.gameEndTurnResolve,
    GameStateActions.gameGoToNextPhaseResolve,
    GameStateActions.gameGoToPhaseResolve,
    (draft, action) => {
      draft.stateActionsQueue.pop();
      if(draft.turnPhaseIndex === 2){
        draft.continuationApproval[draft.currentPlayerKey] = true;
        draft.continuationApproval[getOtherPlayerKey(draft.currentPlayerKey)] = false;
      }
    }
  ),
  immerOn(
    GameStateActions.gameGoToNextPhaseResolve,
    GameStateActions.gameGoToPhaseResolve,
    (draft, action) => {
      ['player', 'opponent'].forEach(pKey => {
        const cardPlayableCheckPayload = getCardPlayableCheckPayload(draft, { playerKey: pKey as PlayerKey });

        draft[pKey as PlayerKey].hand.forEach(card => {
          card.playable = getIsCardPlayable({
            ...cardPlayableCheckPayload,
            card
          });
        });
      });
    }
  ),
  immerOn(
    GameStateActions.gameSetupNextTurn,
    (draft, action) => {
      draft.currentPlayerKey = getOtherPlayerKey(draft.currentPlayerKey);
      draft.counterPlayStatus = getResetCounterPlayStatus(),
      draft.continuationApproval = getResetContinuationApproval(),

      draft[draft.currentPlayerKey].playedFoodThisTurn = false;
      draft[draft.currentPlayerKey].currentFood = draft[draft.currentPlayerKey].baseFood;
      draft[draft.currentPlayerKey].cardsInPlay.forEach(card => {
        card.dizzy = false;
        card.tired = false;
      });

      ['player', 'opponent'].forEach(pKey => {
        draft[pKey as PlayerKey].cardsInPlay.forEach(card => {
          card.effectedPersonallyBy = [];
          card.strength = card.baseStrength;
          card.energy = card.baseEnergy;

          const pipedCompanion = pipeCompanion(card, draft.activeEffects);

          Object.keys(pipedCompanion).forEach(key => {
            card[key] = pipedCompanion[key];
          });
        });
      });
    }
  ),
  immerOn(
    GameStateActions.gameStartTurn,
    (draft, action) => {
      draft.turnPhaseIndex = 0;
      draft.turn++;
      draft.transitioning = false;

      ['player', 'opponent'].forEach(pKey => {
        const cardPlayableCheckPayload = getCardPlayableCheckPayload(draft, { playerKey: pKey as PlayerKey });

        draft[pKey as PlayerKey].hand.forEach(card => {
          card.playable = getIsCardPlayable({
            ...cardPlayableCheckPayload,
            card
          });
        });
      });
    }
  ),

  immerOn(
    GameStateActions.gameChooseAttackers,
    (draft, action) => {
      const cardsIds = action.cards.map(card => card.gameObjectId);

      draft[action.playerKey].cardsInPlay.forEach(card => {
        if(cardsIds.includes(card.gameObjectId)){
          card.attacking = true;
        } else {
          card.attacking = false;
        }
      });
    }
  ),
  immerOn(
    GameStateActions.gameResolveFightsDamage,
    (draft, action) => {
      const attackerIdsInFights = draft.fightQueue.map(fight => fight.attacker.gameObjectId);
      const unblockedAttackers = draft[draft.currentPlayerKey].cardsInPlay
        .filter(card => card.attacking && !attackerIdsInFights.includes(card.gameObjectId))

      draft.fightQueue.forEach(({ attacker, defender }) => {
        attacker.energy -= defender.strength;
        defender.energy -= attacker.strength;
        attacker.tired = true;
        attacker.attacking = false;

        if(attacker.energy < 0){
          draft[attacker.playerKey].sleepyard.unshift({
            ...draft[attacker.playerKey].cardsInPlay.splice(
              draft[attacker.playerKey].cardsInPlay.findIndex(card => card.gameObjectId === attacker.gameObjectId),
              1
            )[0],
            turnsLeft: 5
          });
        }

        if(defender.energy < 0){
          draft[defender.playerKey].sleepyard.unshift({
            ...draft[defender.playerKey].cardsInPlay.splice(
              draft[defender.playerKey].cardsInPlay.findIndex(card => card.gameObjectId === defender.gameObjectId),
              1
            )[0],
            turnsLeft: 5
          });
        }
      });

      unblockedAttackers.forEach(attacker => {
        draft[getOtherPlayerKey(draft.currentPlayerKey)].energy -= attacker.strength;
      });
    }
  ),
  immerOn(
    GameStateActions.gameResolveFights,
    (draft, action) => {
      draft[draft.currentPlayerKey].cardsInPlay.forEach(card => {
        if(card.attacking){
          card.attacking = false;
          card.tired = true;
        }
      });

      draft[getOtherPlayerKey(draft.currentPlayerKey)].cardsInPlay.forEach(card => {
        if(card.defending){
          card.defending = false;
        }
      });

      draft.fightQueue = [];
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
  ),
  immerOn(
    GameEffectActions.gameHealPlayer,
    (draft, action) => {
      console.log(action);
      draft[action.playerKey].energy += action.amount;
    }
  )
)
