import { Action, createAction, props } from '@ngrx/store';

import { CardEffectType, CardType } from '@core/cards/cards.types';
import { AuraPayload, EffectValues, PlayerKey } from '@core/game/game.types';
import { ActionCreator } from '@ngrx/store/src/models';

/* Actions triggered by cards and everything within the TCG system */

export interface GameEffectAction extends Action {
  readonly type: GameEffectActionType;
  readonly cardEffectTypes: CardEffectType[];
  readonly cardTypes: CardType[];
}

export interface GameEffect {
  readonly cardEffectTypes: CardEffectType[];
  readonly cardTypes: CardType[];
  getAction: ActionCreator<GameEffectActionType>;
  readonly name: string;
  readonly onExecutionMsg?: string;
}

export interface GameEffectMap {
  [key: string]: GameEffect;
}

//#region Action types

export enum GameEffectActionType {
  //#region Destroy
  DESTROY_TARGET = '[Game Effect] Destroy Target',
  DESTROY_ALL = '[Game Effect] Destroy All',
  DESTROY_ALL_EXCEPT = '[Game Effect] Destroy All Except',
  //#endregion

  //#region Damage
  DAMAGE_TARGET = '[Game Effect] Damage Target',
  DAMAGE_ENEMIES = '[Game Effect] Damage Enemies',
  DAMAGE_ALL = '[Game Effect] Damage All',
  DAMAGE_ALL_EXCEPT = '[Game Effect] Damage All Except',
  //#endregion

  //#region Buff
  BUFF_TARGET = '[Game Effect] Buff Target',
  BUFF_ALLIES = '[Game Effect] Buff Allies',
  //#endregion

  //#region Debuff
  DEBUFF_TARGET = '[Game Effect] Debuff Target',
  DEBUFF_ENEMIES = '[Game Effect] Debuff Enemies',
  //#endregion

  //#region Auras
  AURA_BUFF_ALLIES = '[Game Effect] Aura Buff Allies',
  AURA_BUFF_ALLIES_EXCEPT = '[Game Effect] Aura Buff Allies Except',
  AURA_DEBUFF_ENEMIES = '[Game Effect] Aura Debuff Enemies',
  AURA_DEBUFF_ALL_EXCEPT = '[Game Effect] Aura Debuff All Except',
  //#endregion

  //#region Heal
  HEAL_PLAYER = '[Game Effect] Heal Player',
  //#endregion

  //#region Food
  ADD_FOOD = '[Game Effect] Add Food',
  //#endregion

  //#region Other
  DRAW_X_CARDS = '[Game Effect] Draw X cards',
  SHUFFLE_DECK = '[Game Effect] Shuffle deck',
  //#endregion
}

//#endregion Action Types

//#region Actions

//#region Destroy
export const gameDestroyTarget = createAction(
  GameEffectActionType.DESTROY_TARGET,
  props<{ targetId: string }>()
);

export const gameDestroyAll = createAction(GameEffectActionType.DESTROY_ALL);

export const gameDestroyAllExcept = createAction(
  GameEffectActionType.DESTROY_ALL_EXCEPT,
  props<{ targetId: string }>()
);
//#endregion

//#region Damage
export const gameDamageTarget = createAction(
  GameEffectActionType.DAMAGE_TARGET,
  props<{ damage: number, targetId: string }>()
);

export const gameDamageEnemies = createAction(
  GameEffectActionType.DAMAGE_ENEMIES,
  props<{ damage: number }>()
);

export const gameDamageAll = createAction(
  GameEffectActionType.DAMAGE_ALL,
  props<{ damage: number }>()
);

export const gameDamageAllExcept = createAction(
  GameEffectActionType.DAMAGE_ALL_EXCEPT,
  props<{ damage: number, targetId: string }>()
);
//#endregion

//#region Buff
export const gameBuffTarget = createAction(
  GameEffectActionType.BUFF_TARGET,
  props<{ ownerId: string, values: EffectValues, targetId: string }>()
);

export const gameBuffAllies = createAction(
  GameEffectActionType.BUFF_ALLIES,
  props<{ ownerId: string, values: EffectValues }>()
);
//#endregion

//#region Debuff
export const gameDebuffTarget = createAction(
  GameEffectActionType.DEBUFF_TARGET,
  props<{ ownerId: string, values: EffectValues, targetId: string }>()
);

export const gameDebuffEnemies = createAction(
  GameEffectActionType.DEBUFF_ENEMIES,
  props<{ ownerId: string, values: EffectValues }>()
);
//#endregion

//#region Auras
export const gameAuraBuffAllies = createAction(
  GameEffectActionType.AURA_BUFF_ALLIES,
  props<AuraPayload>()
);

export const gameAuraBuffAlliesExcept = createAction(
  GameEffectActionType.AURA_BUFF_ALLIES_EXCEPT,
  props<AuraPayload>()
);

export const gameAuraDebuffEnemies = createAction(
  GameEffectActionType.AURA_DEBUFF_ENEMIES,
  props<AuraPayload>()
);

export const gameAuraDebuffAllExcept = createAction(
  GameEffectActionType.AURA_DEBUFF_ALL_EXCEPT,
  props<AuraPayload>()
);
//#endregion

//#region Heal
export const gameHealPlayer = createAction(
  GameEffectActionType.HEAL_PLAYER,
  props<{ amount: number }>()
);
//#endregion

//#region Food
export const gameAddFood = createAction(
  GameEffectActionType.ADD_FOOD,
  props<{ amount: number }>()
);
//#endregion

//#region Other
export const gameDrawXCards = createAction(
  GameEffectActionType.DRAW_X_CARDS,
  props<{ amount: number, playerKey: PlayerKey }>()
);

export const gameShuffleDeck = createAction(
  GameEffectActionType.SHUFFLE_DECK,
  props<{ playerKey: PlayerKey }>()
);
//#endregion

//#endregion

//#region Action Map
export const getGameEffectsMap = (): GameEffectMap => ({
  //#region Destroy
  [GameEffectActionType.DESTROY_TARGET]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Trick
    ],
    getAction: gameDestroyTarget,
    name: 'Destroy a companion',
    onExecutionMsg: 'Choose a companion to destroy.'
  },

  [GameEffectActionType.DESTROY_ALL]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Trick
    ],
    getAction: gameDestroyAll,
    name: 'Destroy all companions'
  },

  [GameEffectActionType.DESTROY_ALL_EXCEPT]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: gameDestroyAllExcept,
    name: 'Destroy all companions but this one'
  },
  //#endregion
  
  //#region Damage
  [GameEffectActionType.DAMAGE_TARGET]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Companion,
      CardType.Trick
    ],
    getAction: gameDamageTarget,
    name: 'Damage a companion or player',
    onExecutionMsg: 'Choose the target you want to damage'
  },

  [GameEffectActionType.DAMAGE_ENEMIES]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Companion,
      CardType.Trick
    ],
    getAction: gameDamageEnemies,
    name: 'Damage enemies'
  },

  [GameEffectActionType.DAMAGE_ALL]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Companion,
      CardType.Trick
    ],
    getAction: gameDamageAll,
    name: 'Damage all companions'
  },

  [GameEffectActionType.DAMAGE_ALL_EXCEPT]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: gameDamageAllExcept,
    name: 'Damage all companions but this one'
  },
  //#endregion

  //#region Buff
  [GameEffectActionType.BUFF_TARGET]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Trick
    ],
    getAction: gameBuffTarget,
    name: 'Buff target until end of turn',
    onExecutionMsg: 'Choose a companion to receive this effect until end of turn.'
  },

  [GameEffectActionType.BUFF_ALLIES]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Trick
    ],
    getAction: gameBuffAllies,
    name: 'Buff allies until end of turn'
  },
  //#endregion

  //#region Debuff
  [GameEffectActionType.DEBUFF_TARGET]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Trick
    ],
    getAction: gameDebuffTarget,
    name: 'Debuff target until end of turn',
    onExecutionMsg: 'Choose a companion to receive this effect until end of turn.'
  },
  
  [GameEffectActionType.DEBUFF_ENEMIES]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Trick
    ],
    getAction: gameDebuffEnemies,
    name: 'Debuff enemies until end of turn'
  },
  //#endregion
  
  //#region Auras
  [GameEffectActionType.AURA_BUFF_ALLIES]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: gameAuraBuffAllies,
    name: 'Buff allies'
  },

  [GameEffectActionType.AURA_BUFF_ALLIES_EXCEPT]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: gameAuraBuffAlliesExcept,
    name: 'Buff your other companions'
  },

  [GameEffectActionType.AURA_DEBUFF_ENEMIES]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: gameAuraDebuffEnemies,
    name: 'Debuff enemies'
  },

  [GameEffectActionType.AURA_DEBUFF_ALL_EXCEPT]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: gameAuraDebuffAllExcept,
    name: 'Debuff all companions but this one'
  },
  //#endregion

  //#region Heal
  [GameEffectActionType.HEAL_PLAYER]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Companion,
      CardType.Trick
    ],
    getAction: gameHealPlayer,
    name: 'Heal player'
  },
  //#endregion

  //#region Food
  [GameEffectActionType.ADD_FOOD]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Food
    ],
    getAction: gameAddFood,
    name: 'Add Food'
  },
  //#endregion

  //#region Other
  [GameEffectActionType.DRAW_X_CARDS]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Companion,
      CardType.Trick
    ],
    getAction: gameDrawXCards,
    name: 'Draw X Cards'
  },

  [GameEffectActionType.SHUFFLE_DECK]: {
    cardEffectTypes: [
      CardEffectType.OnEnterEffect,
      CardEffectType.OnExitEffect
    ],
    cardTypes: [
      CardType.Charm,
      CardType.Companion,
      CardType.Trick
    ],
    getAction: gameShuffleDeck,
    name: 'Shuffle deck'
  },
  //#endregion
});
//#endregion
