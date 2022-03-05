import { Action, createAction, props } from '@ngrx/store';

import { CardEffectType, CardType } from '@core/cards/cards.types';
import { AuraPayload, EffectPayloadWithTargetId, EffectPayloadWithAmount, EffectPayloadWithAmountAndTargetId, EffectPayloadWithPlayerKey, EffectPayloadWithAmountAndPlayerKey, EffectPayloadWithPlayerKeyAndEffectValuesAndTargetId, EffectPayloadWithPlayerKeyAndEffectValues, EffectPayloadType } from '@core/game/game.types';
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
  readonly payload?: Partial<EffectPayloadType>;
  readonly name: string;
  readonly onExecutionMsg?: string;
  readonly type: GameEffectActionType;
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
  props<EffectPayloadWithTargetId>()
);

export const gameDestroyAll = createAction(GameEffectActionType.DESTROY_ALL);

export const gameDestroyAllExcept = createAction(
  GameEffectActionType.DESTROY_ALL_EXCEPT,
  props<EffectPayloadWithTargetId>()
);
//#endregion

//#region Damage
export const gameDamageTarget = createAction(
  GameEffectActionType.DAMAGE_TARGET,
  props<EffectPayloadWithAmountAndTargetId>()
);

export const gameDamageEnemies = createAction(
  GameEffectActionType.DAMAGE_ENEMIES,
  props<EffectPayloadWithAmountAndPlayerKey>()
);

export const gameDamageAll = createAction(
  GameEffectActionType.DAMAGE_ALL,
  props<EffectPayloadWithAmount>()
);

export const gameDamageAllExcept = createAction(
  GameEffectActionType.DAMAGE_ALL_EXCEPT,
  props<EffectPayloadWithAmountAndTargetId>()
);
//#endregion

//#region Buff
export const gameBuffTarget = createAction(
  GameEffectActionType.BUFF_TARGET,
  props<EffectPayloadWithPlayerKeyAndEffectValuesAndTargetId>()
);

export const gameBuffAllies = createAction(
  GameEffectActionType.BUFF_ALLIES,
  props<EffectPayloadWithPlayerKeyAndEffectValues>()
);
//#endregion

//#region Debuff
export const gameDebuffTarget = createAction(
  GameEffectActionType.DEBUFF_TARGET,
  props<EffectPayloadWithPlayerKeyAndEffectValuesAndTargetId>()
);

export const gameDebuffEnemies = createAction(
  GameEffectActionType.DEBUFF_ENEMIES,
  props<EffectPayloadWithPlayerKeyAndEffectValues>()
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
  props<EffectPayloadWithAmountAndPlayerKey>()
);
//#endregion

//#region Food
export const gameAddFood = createAction(
  GameEffectActionType.ADD_FOOD,
  props<EffectPayloadWithAmountAndPlayerKey>()
);
//#endregion

//#region Other
export const gameDrawXCards = createAction(
  GameEffectActionType.DRAW_X_CARDS,
  props<EffectPayloadWithAmountAndPlayerKey>()
);

export const gameShuffleDeck = createAction(
  GameEffectActionType.SHUFFLE_DECK,
  props<EffectPayloadWithPlayerKey>()
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
    onExecutionMsg: 'Choose a companion to destroy.',
    type: GameEffectActionType.DESTROY_TARGET
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
    name: 'Destroy all companions',
    type: GameEffectActionType.DESTROY_ALL
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
    name: 'Destroy all companions but this one',
    type: GameEffectActionType.DESTROY_ALL_EXCEPT
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
    onExecutionMsg: 'Choose the target you want to damage',
    type: GameEffectActionType.DAMAGE_TARGET
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
    name: 'Damage enemies',
    type: GameEffectActionType.DAMAGE_ENEMIES
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
    name: 'Damage all companions',
    type: GameEffectActionType.DAMAGE_ALL
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
    name: 'Damage all companions but this one',
    type: GameEffectActionType.DAMAGE_ALL_EXCEPT
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
    onExecutionMsg: 'Choose a companion to receive this effect until end of turn.',
    type: GameEffectActionType.BUFF_TARGET
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
    name: 'Buff allies until end of turn',
    type: GameEffectActionType.BUFF_ALLIES
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
    onExecutionMsg: 'Choose a companion to receive this effect until end of turn.',
    type: GameEffectActionType.DEBUFF_TARGET
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
    name: 'Debuff enemies until end of turn',
    type: GameEffectActionType.DEBUFF_ENEMIES
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
    name: 'Buff allies',
    type: GameEffectActionType.AURA_BUFF_ALLIES
  },

  [GameEffectActionType.AURA_BUFF_ALLIES_EXCEPT]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: gameAuraBuffAlliesExcept,
    name: 'Buff your other companions',
    type: GameEffectActionType.AURA_BUFF_ALLIES_EXCEPT
  },

  [GameEffectActionType.AURA_DEBUFF_ENEMIES]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: gameAuraDebuffEnemies,
    name: 'Debuff enemies',
    type: GameEffectActionType.AURA_DEBUFF_ENEMIES
  },

  [GameEffectActionType.AURA_DEBUFF_ALL_EXCEPT]: {
    cardEffectTypes: [
      CardEffectType.AuraEffect
    ],
    cardTypes: [
      CardType.Companion
    ],
    getAction: gameAuraDebuffAllExcept,
    name: 'Debuff all companions but this one',
    type: GameEffectActionType.AURA_DEBUFF_ALL_EXCEPT
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
    name: 'Heal player',
    type: GameEffectActionType.HEAL_PLAYER
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
    name: 'Add Food',
    type: GameEffectActionType.ADD_FOOD
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
    name: 'Draw X Cards',
    type: GameEffectActionType.DRAW_X_CARDS
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
    name: 'Shuffle deck',
    type: GameEffectActionType.SHUFFLE_DECK
  },
  //#endregion
});
//#endregion
