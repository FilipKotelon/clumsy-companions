import { CardEffectType, CardType, EffectValues } from '@core/cards/cards.types';
import { Action } from '@ngrx/store';

/* Actions triggered by cards and everything within the TCG system */

export enum AuraTarget {
  Friends,
  Enemies,
  All,
  AllExcept
}

export interface AuraPayload {
  target: AuraTarget;
  values: EffectValues;
}

export interface GameEffectAction extends Action {
  readonly type: GameEffectActionType;
  readonly cardEffectTypes: CardEffectType[];
  readonly cardTypes: CardType[];
}

//#region Action types

export enum GameEffectActionType {
  GAME_EFFECT_DAMAGE_TARGET = '[Game Effect] Damage Target',
  GAME_EFFECT_AURA_BUFF = '[Game Effect] Aura Buff',
  GAME_EFFECT_AURA_DEBUFF = '[Game Effect] Aura Debuff',
  GAME_EFFECT_ADD_FOOD = '[Game Effect] Add Food',
}

//#endregion Action Types

//#region Actions
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

export class GameEffectAuraBuff implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_AURA_BUFF;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect,
    CardEffectType.OnEnterEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Companion,
    CardType.Trick
  ];

  constructor( payload: AuraPayload ) {}
}

export class GameEffectAuraDebuff implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_AURA_DEBUFF;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect,
    CardEffectType.OnEnterEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Companion,
    CardType.Trick
  ];

  constructor( payload: AuraPayload) {}
}

export class GameEffectAddFood implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_ADD_FOOD;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect
  ];
  readonly cardTypes = [
    CardType.Charm,
    CardType.Companion,
    CardType.Food,
    CardType.Trick
  ]
}
//#endregion Actions