import { Action } from '@ngrx/store';

import { CardEffectType, CardType } from '@core/cards/cards.types';
import { EffectValues } from '@core/game/game.types';

/* Actions triggered by cards and everything within the TCG system */

export interface AuraPayload {
  originId: string;
  values: EffectValues;
}

export interface GameEffectAction extends Action {
  readonly type: GameEffectActionType;
  readonly cardEffectTypes: CardEffectType[];
  readonly cardTypes: CardType[];
}

//#region Action types

export enum GameEffectActionType {
  //#region Destroy
  GAME_EFFECT_DESTROY_TARGET = '[Game Effect] Destroy Target',
  GAME_EFFECT_DESTROY_ALL = '[Game Effect] Destroy All',
  GAME_EFFECT_DESTROY_ALL_EXCEPT = '[Game Effect] Destroy All Except',
  //#endregion

  //#region Damage
  GAME_EFFECT_DAMAGE_TARGET = '[Game Effect] Damage Target',
  GAME_EFFECT_DAMAGE_ENEMIES = '[Game Effect] Damage Enemies',
  GAME_EFFECT_DAMAGE_ALL = '[Game Effect] Damage All',
  GAME_EFFECT_DAMAGE_ALL_EXCEPT = '[Game Effect] Damage All Except',
  //#endregion

  //#region Buff
  GAME_EFFECT_BUFF_TARGET = '[Game Effect] Buff Target',
  GAME_EFFECT_BUFF_ALLIES = '[Game Effect] Buff Allies',
  //#endregion

  //#region Debuff
  GAME_EFFECT_DEBUFF_TARGET = '[Game Effect] Debuff Target',
  GAME_EFFECT_DEBUFF_ENEMIES = '[Game Effect] Debuff Enemies',
  //#endregion

  //#region Auras
  GAME_EFFECT_AURA_BUFF_ALLIES = '[Game Effect] Aura Buff Allies',
  GAME_EFFECT_AURA_BUFF_ALLIES_EXCEPT = '[Game Effect] Aura Buff Allies Except',
  GAME_EFFECT_AURA_DEBUFF_ENEMIES = '[Game Effect] Aura Debuff Enemies',
  GAME_EFFECT_AURA_DEBUFF_ALL_EXCEPT = '[Game Effect] Aura Debuff All Except',
  //#endregion

  //#region Heal
  GAME_EFFECT_HEAL_PLAYER = '[Game Effect] Heal Player',
  //#endregion

  //#region Food
  GAME_EFFECT_ADD_FOOD = '[Game Effect] Add Food',
  //#endregion Food
}

//#endregion Action Types

//#region Actions

//#region Destroy
export class GameEffectDestroyTarget implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DESTROY_TARGET;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect,
    CardEffectType.OnExitEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Trick
  ];

  constructor( payload: { targetId: string }) {}
}

export class GameEffectDestroyAll implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DESTROY_ALL;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect,
    CardEffectType.OnExitEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Trick
  ];
}

export class GameEffectDestroyAllExcept implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DESTROY_ALL_EXCEPT;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect,
    CardEffectType.OnExitEffect
  ];
  readonly cardTypes = [
    CardType.Companion
  ];

  constructor( payload: { targetId: string }) {}
}
//#endregion

//#region Damage
export class GameEffectDamageTarget implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DAMAGE_TARGET;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect,
    CardEffectType.OnExitEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Companion,
    CardType.Trick
  ];

  constructor( payload: { damage: number, targetId: string }) {}
}

export class GameEffectDamageEnemies implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DAMAGE_ENEMIES;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect,
    CardEffectType.OnExitEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Companion,
    CardType.Trick
  ];

  constructor( payload: { damage: number }) {}
}

export class GameEffectDamageAll implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DAMAGE_ALL;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect,
    CardEffectType.OnExitEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Companion,
    CardType.Trick
  ];

  constructor( payload: { damage: number }) {}
}

export class GameEffectDamageAllExcept implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DAMAGE_ALL_EXCEPT;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect,
    CardEffectType.OnExitEffect
  ];
  readonly cardTypes = [
    CardType.Companion
  ];

  constructor( payload: { damage: number, excludedTargetId: string }) {}
}
//#endregion

//#region Buff
export class GameEffectBuffTarget implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_BUFF_TARGET;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Trick
  ];

  constructor( payload: { values: EffectValues, targetId: string }) {}
}

export class GameEffectBuffAllies implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_BUFF_ALLIES;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Trick
  ];

  constructor( payload: { values: EffectValues }) {}
}
//#endregion

//#region Debuff
export class GameEffectDebuffTarget implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DEBUFF_TARGET;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Trick
  ];

  constructor( payload: { values: EffectValues, targetId: string }) {}
}

export class GameEffectDebuffEnemies implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DEBUFF_ENEMIES;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Trick
  ];

  constructor( payload: { values: EffectValues }) {}
}
//#endregion

//#region Auras
export class GameEffectAuraBuffAllies implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_AURA_BUFF_ALLIES;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect
  ];
  readonly cardTypes = [
    CardType.Companion
  ];

  constructor( payload: AuraPayload ) {}
}

export class GameEffectAuraBuffAlliesExcept implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_AURA_BUFF_ALLIES_EXCEPT;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect
  ];
  readonly cardTypes = [
    CardType.Companion
  ];

  constructor( payload: AuraPayload ) {}
}

export class GameEffectAuraDebuffEnemies implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_AURA_DEBUFF_ENEMIES;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect
  ];
  readonly cardTypes = [
    CardType.Companion
  ];

  constructor( payload: AuraPayload ) {}
}

export class GameEffectAuraDebuffAllExcept implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_AURA_DEBUFF_ALL_EXCEPT;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect
  ];
  readonly cardTypes = [
    CardType.Companion
  ];

  constructor( payload: AuraPayload ) {}
}
//#endregion

//#region Heal
export class GameEffectHealPlayer implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_HEAL_PLAYER;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect,
    CardEffectType.OnExitEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Companion,
    CardType.Trick
  ]

  constructor( payload: number ) {}
}
//#endregion

//#region Food
export class GameEffectAddFood implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_ADD_FOOD;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect
  ];
  readonly cardTypes = [
    CardType.Food
  ]

  constructor( payload: number = 1 ) {}
}
//#endregion

//#endregion Actions