import { ActionCreator, createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { AuraTarget, BuffTarget, CardFight, ContinuationApproval, CounterPlayStatus, EffectPayloadType, GameActiveEffects, GameGiftData, InGameCard, InGamePlayer, PlayerKey, TURN_PHASES } from '@core/game/game.types';

import * as GameEffectActions from './game-effect.actions';
import * as GameStateActions from '@core/game/store/game-state.actions';
import { getCardPlayableCheckPayload, getEmptyPlayer, getHasPlayableCards, getIsCardPlayable, getOtherPlayerKey, getResetContinuationApproval, getResetCounterPlayStatus, shuffleCards, pipeCompanion, getEffectValues } from '../game.helpers';
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
  gameEndedByDraw: boolean;
  winner: PlayerKey;
  winMaxReward: GameGiftData;
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
  gameEndedByDraw: false,
  winner: null,
  winMaxReward: null,
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

      draft.winMaxReward = {
        coins: action.opponent.coinsReward,
        packId: action.opponent.rewardPackId
      };
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

  // Przechwytywanie akcji zagrania karty
  immerOn(
    GameStateActions.gamePlayCard,
    (draft, action) => {
      // Dodanie karty do kolejki
      draft.cardsQueue.push(
        ...draft[action.playerKey].hand.splice(
          draft[action.playerKey].hand.findIndex(card => card.gameObjectId === action.card.gameObjectId),
          1
        )
      );

      // Zap??acenie za koszt karty, je??li nie jest to karta po??ywienia (kt??ra jest darmowa)
      if(action.card.type !== CardType.Food){
        draft[action.playerKey].currentFood -= action.card.cost;
      }

      const cardPlayableCheckPayload = getCardPlayableCheckPayload(draft, action);
      cardPlayableCheckPayload.canCounter = getHasPlayableCards(draft[getOtherPlayerKey(action.playerKey)].hand, cardPlayableCheckPayload);
      draft.continuationApproval = { player: true, opponent: true };

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

              if([GameEffectActions.GameEffectActionType.DRAW_X_CARDS,
                GameEffectActions.GameEffectActionType.ADD_FOOD,
                GameEffectActions.GameEffectActionType.HEAL_PLAYER,
                GameEffectActions.GameEffectActionType.DAMAGE_ALL,
                GameEffectActions.GameEffectActionType.DAMAGE_ALL_EXCEPT,
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
                GameEffectActions.GameEffectActionType.DAMAGE_ENEMIES,
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

              if([GameEffectActions.GameEffectActionType.DAMAGE_ALL_EXCEPT,
                GameEffectActions.GameEffectActionType.DESTROY_ALL_EXCEPT].includes(effect.action.type)){
                payload.targetId = action.card.gameObjectId;
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

      if(draft.continuationApproval[getOtherPlayerKey(action.playerKey)]){
        draft.counterPlayStatus = getResetCounterPlayStatus();
      }
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
    }
  ),
  // Przechwytywanie akcji przej??cia do nast??pnej lub wybranej fazy tury w reduktorze stanu
  immerOn(
    GameStateActions.gameGoToNextPhaseResolve,
    GameStateActions.gameGoToPhaseResolve,
    (draft, action) => {
      // Dla ka??dego gracza, jego karty w r??ce s?? aktualizowane
      ['player', 'opponent'].forEach(pKey => {
        // Z obecnego stanu gry pobierane s?? informacje potrzebne do okre??lenia, czy dana karta mo??e by?? zagrana
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
      draft.activeEffects.buffs = [];

      draft[draft.currentPlayerKey].playedFoodThisTurn = false;
      draft[draft.currentPlayerKey].currentFood = draft[draft.currentPlayerKey].baseFood;
      draft[draft.currentPlayerKey].cardsInPlay.forEach(card => {
        card.dizzy = false;
        card.tired = false;
      });

      ['player', 'opponent'].forEach(pKey => {
        draft[pKey as PlayerKey].cardsInPlay.forEach(card => {
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
  // Przechwycenie akcji z danymi odno??nie wybranych walk podj??tych w obronie
  immerOn(
    GameStateActions.gameChooseFightsInDefense,
    (draft, action) => {
      const cardsIds = action.fights.map(fight => fight.defender.gameObjectId);
      // Przypisanie walk do stanu gry
      draft.fightQueue = action.fights;

      // Nadanie obro??com statusu
      draft[action.playerKey].cardsInPlay.forEach(card => {
        if(cardsIds.includes(card.gameObjectId)){
          card.defending = true;
        } else {
          card.defending = false;
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
        if(defender.strength > 0){
          draft.activeEffects.buffs.push({
            positive: false,
            target: BuffTarget.Target,
            targetId: attacker.gameObjectId,
            values: getEffectValues({ energy: defender.strength }),
            playerKey: attacker.playerKey
          });
        }

        if(attacker.strength > 0){
          draft.activeEffects.buffs.push({
            positive: false,
            target: BuffTarget.Target,
            targetId: defender.gameObjectId,
            values: getEffectValues({ energy: attacker.strength }),
            playerKey: defender.playerKey
          });
        }
      });

      unblockedAttackers.forEach(attacker => {
        if(attacker.strength > 0){
          draft[getOtherPlayerKey(draft.currentPlayerKey)].energy -= attacker.strength;
        }
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
      if(draft[action.playerKey].deck.length){
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
      } else {
        draft.gameEndedByDraw = true;
      }
    }
  ),
  immerOn(
    GameEffectActions.gameHealPlayer,
    (draft, action) => {
      draft[action.playerKey].energy += action.amount;
    }
  ),
  immerOn(
    GameEffectActions.gameDestroyTarget,
    (draft, action) => {
      const target = [...draft.player.cardsInPlay, ...draft.opponent.cardsInPlay].find(card => card.gameObjectId === action.targetId);

      draft[target.playerKey].sleepyard.push({
        ...draft[target.playerKey].cardsInPlay.splice(
          draft[target.playerKey].cardsInPlay.findIndex(card => card.gameObjectId === target.gameObjectId),
          1
        )[0],
        turnsLeft: 5
      });
    }
  ),
  immerOn(
    GameEffectActions.gameDestroyAll,
    (draft, action) => {
      ['player', 'opponent'].forEach((pKey: PlayerKey) => {
        draft[pKey].sleepyard.push(...draft[pKey].cardsInPlay.map(card => ({ ...card, turnsLeft: 5 })));
        draft[pKey].cardsInPlay = [];
      });
    }
  ),
  immerOn(
    GameEffectActions.gameDestroyAllExcept,
    (draft, action) => {
      const target = [...draft.player.cardsInPlay, ...draft.opponent.cardsInPlay].find(card => card.gameObjectId === action.targetId);

      ['player', 'opponent'].forEach((pKey: PlayerKey) => {
        draft[pKey].sleepyard.push(
          ...draft[pKey].cardsInPlay
            .filter(card => card.gameObjectId !== target.gameObjectId)
            .map(card => ({ ...card, turnsLeft: 5 }))
        );

        if(target.playerKey === pKey){
          draft[pKey].cardsInPlay = [target];
        } else {
          draft[pKey].cardsInPlay = [];
        }
      });
    }
  ),
  // Przechwycenie akcji odpowiadaj??cej efektowi, kt??ry zadaje obra??enia wybranemu kompanowi
  immerOn(
    GameEffectActions.gameDamageTarget,
    (draft, action) => {
      // Znalezienie celu na planszy po jego unikalnym identyfikatorze
      const target = [...draft.player.cardsInPlay, ...draft.opponent.cardsInPlay].find(card => card.gameObjectId === action.targetId);

      // Obni??enie enegii celu
      draft.activeEffects.buffs.push({
        positive: false,
        target: BuffTarget.Target,
        targetId: target.gameObjectId,
        values: getEffectValues({ energy: action.amount }),
        playerKey: target.playerKey
      });
    }
  ),
  immerOn(
    GameEffectActions.gameDamageEnemies,
    (draft, action) => {
      const otherPlayerKey = getOtherPlayerKey(action.playerKey);

      draft[otherPlayerKey].cardsInPlay.forEach(card => {
        draft.activeEffects.buffs.push({
          positive: false,
          target: BuffTarget.Target,
          targetId: card.gameObjectId,
          values: getEffectValues({ energy: action.amount }),
          playerKey: card.playerKey
        });
      });
    }
  ),
  immerOn(
    GameEffectActions.gameDamageAll,
    (draft, action) => {
      ['player', 'opponent'].forEach((pKey: PlayerKey) => {
        draft[pKey].cardsInPlay.forEach(card => {
          draft.activeEffects.buffs.push({
            positive: false,
            target: BuffTarget.Target,
            targetId: card.gameObjectId,
            values: getEffectValues({ energy: action.amount }),
            playerKey: card.playerKey
          });
        });
      });
    }
  ),
  immerOn(
    GameEffectActions.gameDamageAllExcept,
    (draft, action) => {
      ['player', 'opponent'].forEach((pKey: PlayerKey) => {
        draft[pKey].cardsInPlay.forEach(card => {
          if(card.gameObjectId !== action.targetId){
            draft.activeEffects.buffs.push({
              positive: false,
              target: BuffTarget.Target,
              targetId: card.gameObjectId,
              values: getEffectValues({ energy: action.amount }),
              playerKey: card.playerKey
            });
          }
        });
      });
    }
  ),
  immerOn(
    GameEffectActions.gameDestroyTarget,
    GameEffectActions.gameDamageTarget,
    (draft, action) => {
      if(draft.fightQueue.length){
        const curPlayerCards = draft[draft.currentPlayerKey].cardsInPlay;
        const otherPlayerCards = draft[getOtherPlayerKey(draft.currentPlayerKey)].cardsInPlay;

        const filteredQueue = [...draft.fightQueue].filter(fight => {
          return curPlayerCards.find(card => card.gameObjectId === fight.attacker.gameObjectId)
            && otherPlayerCards.find(card => card.gameObjectId === fight.defender.gameObjectId)
        });

        if(filteredQueue.length !== draft.fightQueue.length){
          draft.fightQueue = filteredQueue;
        }
      }
    }
  ),
  immerOn(
    GameEffectActions.gameBuffTarget,
    (draft, action) => {
      draft.activeEffects.buffs.push({
        positive: true,
        target: BuffTarget.Target,
        targetId: action.targetId,
        values: action.values,
        playerKey: action.playerKey
      });
    }
  ),
  immerOn(
    GameEffectActions.gameBuffAllies,
    (draft, action) => {
      draft.activeEffects.buffs.push({
        positive: true,
        target: BuffTarget.Allies,
        values: action.values,
        playerKey: action.playerKey
      });
    }
  ),
  immerOn(
    GameEffectActions.gameDebuffTarget,
    (draft, action) => {
      draft.activeEffects.buffs.push({
        positive: false,
        target: BuffTarget.Target,
        targetId: action.targetId,
        values: action.values,
        playerKey: action.playerKey
      });
    }
  ),
  immerOn(
    GameEffectActions.gameDebuffEnemies,
    (draft, action) => {
      draft.activeEffects.buffs.push({
        positive: false,
        target: BuffTarget.Enemies,
        values: action.values,
        playerKey: action.playerKey
      });
    }
  ),
  immerOn(
    GameStateActions.gameResolveFightsDamage,
    GameEffectActions.gameDamageTarget,
    GameEffectActions.gameDamageEnemies,
    GameEffectActions.gameDamageAll,
    GameEffectActions.gameDamageAllExcept,
    GameEffectActions.gameDebuffTarget,
    GameEffectActions.gameDebuffEnemies,
    (draft, action) => {
      ['player', 'opponent'].forEach((pKey: PlayerKey) => {
        draft[pKey].cardsInPlay.forEach(card => {
          card.strength = card.baseStrength;
          card.energy = card.baseEnergy;

          const pipedCompanion = pipeCompanion(card, draft.activeEffects);

          Object.keys(pipedCompanion).forEach(key => {
            card[key] = pipedCompanion[key];
          });

          if(draft.fightQueue.length){
            const fight = draft.fightQueue.find(fight => card.gameObjectId === fight.defender.gameObjectId || card.gameObjectId === fight.attacker.gameObjectId);

            if(fight){
              if(fight.defender.gameObjectId === card.gameObjectId){
                fight.defender = card;
              } else {
                fight.attacker = card;
              }
            }
          }
        });

        const cardsToSleepyard = draft[pKey].cardsInPlay.filter(card => card.energy <= 0);
        const cardsLeft = draft[pKey].cardsInPlay.filter(card => card.energy > 0);

        if(cardsToSleepyard.length){
          draft[pKey].sleepyard.push(...cardsToSleepyard.map(card => ({ ...card, turnsLeft: 5 })));
          draft[pKey].cardsInPlay = cardsLeft;

          if(draft.fightQueue.length){
            cardsToSleepyard.forEach(card => {
              const fight = draft.fightQueue.find(fight => card.gameObjectId === fight.defender.gameObjectId || card.gameObjectId === fight.attacker.gameObjectId);
              draft.fightQueue.splice(draft.fightQueue.indexOf(fight), 1);
            });
          }
        }
      });
    }
  ),

  immerOn(
    GameEffectActions.gameAuraBuffAllies,
    (draft, action) => {
      draft.activeEffects.auras.push({
        positive: true,
        target: AuraTarget.Allies,
        originId: action.originId,
        values: action.values,
        playerKey: action.playerKey
      });
    }
  ),
  immerOn(
    GameEffectActions.gameAuraBuffAlliesExcept,
    (draft, action) => {
      draft.activeEffects.auras.push({
        positive: true,
        target: AuraTarget.AlliesExcept,
        originId: action.originId,
        values: action.values,
        playerKey: action.playerKey
      });
    }
  ),
  immerOn(
    GameEffectActions.gameAuraDebuffEnemies,
    (draft, action) => {
      draft.activeEffects.auras.push({
        positive: false,
        target: AuraTarget.Enemies,
        originId: action.originId,
        values: action.values,
        playerKey: action.playerKey
      });
    }
  ),
  immerOn(
    GameEffectActions.gameAuraDebuffAllExcept,
    (draft, action) => {
      draft.activeEffects.auras.push({
        positive: false,
        target: AuraTarget.AllExcept,
        originId: action.originId,
        values: action.values,
        playerKey: action.playerKey
      });
    }
  ),

  // Przechywcenie wszystkich akcji, kt??re mog?? usun???? kompana z gry
  immerOn(
    GameStateActions.gameResolveFightsDamage,
    GameEffectActions.gameAuraDebuffEnemies,
    GameEffectActions.gameAuraDebuffAllExcept,
    GameEffectActions.gameDestroyTarget,
    GameEffectActions.gameDestroyAll,
    GameEffectActions.gameDestroyAllExcept,
    GameEffectActions.gameDamageTarget,
    GameEffectActions.gameDamageEnemies,
    GameEffectActions.gameDamageAll,
    GameEffectActions.gameDamageAllExcept,
    GameEffectActions.gameDebuffEnemies,
    GameEffectActions.gameDebuffTarget,
    (draft, action) => {
      const allCardsInPlay = [...draft.player.cardsInPlay, ...draft.opponent.cardsInPlay];

      // Filtrowanie aur, podczas kt??rego usuwane s?? te, kt??re nie maj?? odpowiadaj??cego im kompana na planszy
      draft.activeEffects.auras = draft.activeEffects.auras.filter(aura => allCardsInPlay.find(card => card.gameObjectId === aura.originId));
    }
  ),

  // Apply auras
  immerOn(
    GameStateActions.gameResolveFightsDamage,
    GameEffectActions.gameAuraBuffAllies,
    GameEffectActions.gameAuraBuffAlliesExcept,
    GameEffectActions.gameAuraDebuffEnemies,
    GameEffectActions.gameAuraDebuffAllExcept,
    GameEffectActions.gameDestroyAllExcept,
    GameEffectActions.gameDestroyTarget,
    GameEffectActions.gameDestroyAll,
    GameEffectActions.gameDestroyAllExcept,
    GameEffectActions.gameDamageTarget,
    GameEffectActions.gameDamageEnemies,
    GameEffectActions.gameDamageAll,
    GameEffectActions.gameDamageAllExcept,
    GameEffectActions.gameBuffAllies,
    GameEffectActions.gameBuffTarget,
    GameEffectActions.gameDebuffEnemies,
    GameEffectActions.gameDebuffTarget,
    (draft, action) => {
      ['player', 'opponent'].forEach((pKey: PlayerKey) => {
        draft[pKey].cardsInPlay.forEach(card => {
          card.strength = card.baseStrength;
          card.energy = card.baseEnergy;

          const pipedCompanion = pipeCompanion(card, draft.activeEffects);

          Object.keys(pipedCompanion).forEach(key => {
            card[key] = pipedCompanion[key];
          });
        });

        const cardsToSleepyard = draft[pKey].cardsInPlay.filter(card => card.energy <= 0);
        const cardsLeft = draft[pKey].cardsInPlay.filter(card => card.energy > 0);

        if(cardsToSleepyard.length){
          draft[pKey].sleepyard.push(...cardsToSleepyard.map(card => ({ ...card, turnsLeft: 5 })));
          draft[pKey].cardsInPlay = cardsLeft;
        }
      });
    }
  ),

  immerOn(
    GameStateActions.gameProvideTargetForEffect,
    (draft, action) => {
      draft.effectsQueue[draft.effectsQueue.length - 1].payload.targetId = action.targetId;
    }
  ),
  immerOn(
    GameStateActions.gameResolveEffectInQueue,
    (draft, action) => {
      draft.effectsQueue.pop();
    }
  ),

  immerOn(
    GameStateActions.gameChooseWinner,
    (draft, action) => {
      draft.transitioning = true;
      draft.winner = action.playerKey;
    }
  ),
  immerOn(
    GameStateActions.gameEnd,
    (draft, action) => {
      const cleanState = gameStateFactory();

      Object.keys(cleanState).forEach(key => {
        draft[key] = cleanState[key];
      });
    }
  )
)
