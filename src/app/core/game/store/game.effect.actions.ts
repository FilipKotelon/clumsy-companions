import { Action, createAction, props } from '@ngrx/store';

import { CardEffectType, CardType } from '@core/cards/cards.types';
import { AuraPayload, EffectValues } from '@core/game/game.types';
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
  //#endregion Food
}

//#endregion Action Types

//#region Actions
const getGameEffectsMap = (): GameEffectMap => ({
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
    getAction: createAction(
      GameEffectActionType.DESTROY_TARGET,
      props<{ targetId: string }>()
    ),
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
    getAction: createAction(GameEffectActionType.DESTROY_ALL),
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
    getAction: createAction(
      GameEffectActionType.DESTROY_ALL_EXCEPT,
      props<{ targetId: string }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.DAMAGE_TARGET,
      props<{ damage: number, targetId: string }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.DAMAGE_ENEMIES,
      props<{ damage: number }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.DAMAGE_ALL,
      props<{ damage: number }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.DAMAGE_ALL_EXCEPT,
      props<{ damage: number, targetId: string }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.BUFF_TARGET,
      props<{ ownerId: string, values: EffectValues, targetId: string }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.BUFF_ALLIES,
      props<{ ownerId: string, values: EffectValues }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.DEBUFF_TARGET,
      props<{ ownerId: string, values: EffectValues, targetId: string }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.DEBUFF_ENEMIES,
      props<{ ownerId: string, values: EffectValues }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.AURA_BUFF_ALLIES,
      props<AuraPayload>()
    ),
    name: 'Buff allies'
  },

  [GameEffectActionType.AURA_BUFF_ALLIES_EXCEPT]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: createAction(
      GameEffectActionType.AURA_BUFF_ALLIES_EXCEPT,
      props<AuraPayload>()
    ),
    name: 'Buff your other companions'
  },

  [GameEffectActionType.AURA_DEBUFF_ENEMIES]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: createAction(
      GameEffectActionType.AURA_DEBUFF_ENEMIES,
      props<AuraPayload>()
    ),
    name: 'Debuff enemies'
  },

  [GameEffectActionType.AURA_DEBUFF_ALL_EXCEPT]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: createAction(
      GameEffectActionType.AURA_DEBUFF_ALL_EXCEPT,
      props<AuraPayload>()
    ),
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
    getAction: createAction(
      GameEffectActionType.HEAL_PLAYER,
      props<{ amount: number }>()
    ),
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
    getAction: createAction(
      GameEffectActionType.ADD_FOOD,
      props<{ amount: number }>()
    ),
    name: 'Add Food'
  },
  //#endregion
});
//#endregion Actions

export const GAME_EFFECTS_MAP = getGameEffectsMap();
