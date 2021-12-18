import { EffectValues } from '@shared/components/card/models/card-effect.model'
import { Action } from '@ngrx/store'

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

//#region Action types

export const GAME_EFFECT_DAMAGE_TARGET = '[Game Effect] Damage Target';
export const GAME_EFFECT_AURA_BUFF = '[Game Effect] Aura Buff';
export const GAME_EFFECT_AURA_DEBUFF = '[Game Effect] Aura Debuff';

export type GameEffectActionType = 
  typeof GAME_EFFECT_DAMAGE_TARGET |
  typeof GAME_EFFECT_AURA_BUFF |
  typeof GAME_EFFECT_AURA_DEBUFF

//#endregion Action Types

//#region Actions

export class GameEffectDamageTarget implements Action {
  readonly type = GAME_EFFECT_DAMAGE_TARGET;

  constructor( payload: { damage: number, targetId: string }) {}
}

export class GameEffectAuraBuff implements Action {
  readonly type = GAME_EFFECT_AURA_BUFF;

  constructor( payload: AuraPayload ) {}
}

export class GameEffectAuraDebuff implements Action {
  readonly type = GAME_EFFECT_AURA_DEBUFF;

  constructor( payload: AuraPayload) {}
}

//#endregion Actions