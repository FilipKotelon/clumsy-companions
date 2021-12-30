import { CardEffectType, EffectValues } from '@core/cards/cards.types';
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
}

//#region Action types

export enum GameEffectActionType {
  GAME_EFFECT_DAMAGE_TARGET = '[Game Effect] Damage Target',
  GAME_EFFECT_AURA_BUFF = '[Game Effect] Aura Buff',
  GAME_EFFECT_AURA_DEBUFF = '[Game Effect] Aura Debuff'
}

//#endregion Action Types

//#region Actions

//TODO: Make Action with cardEffectTypes and type an interface to implement
export class GameEffectDamageTarget implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_DAMAGE_TARGET;
  readonly cardEffectTypes = [
    CardEffectType.OnEnterEffect,
    CardEffectType.OnExitEffect
  ]

  constructor( payload: { damage: number, targetId: string }) {}
}

export class GameEffectAuraBuff implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_AURA_BUFF;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect
  ]

  constructor( payload: AuraPayload ) {}
}

export class GameEffectAuraDebuff implements GameEffectAction {
  readonly type = GameEffectActionType.GAME_EFFECT_AURA_DEBUFF;
  readonly cardEffectTypes = [
    CardEffectType.AuraEffect
  ]

  constructor( payload: AuraPayload) {}
}

//#endregion Actions