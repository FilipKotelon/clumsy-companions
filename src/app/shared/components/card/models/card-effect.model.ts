import { GameEffectActionType } from '@game/store/game.effect.actions'
import { GamePhase } from '@game/models/game-phase.model'

export enum CardEffectType {
  AtPhaseEffect = 'atphase',
  AuraEffect = 'aura',
  OnEnterEffect = 'onenter',
  OnExitEffect = 'onexit',
}

export interface EffectValues {
  main: number;
  strength: number;
  energy: number;
}

export class CardEffect {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly effectType: CardEffectType,
    readonly effectAction: GameEffectActionType,
    readonly effectValues: EffectValues,
    readonly effectPhase?: GamePhase
  ) {}
}

export interface OpenableCardEffect {
  open: boolean;
  effect: CardEffect;
}