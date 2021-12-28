import { GameEffectActionType } from '@core/game/store/game.effect.actions';
import { GamePhase } from '@core/game/game.types';

export enum CardEffectType {
  AtPhaseEffect = 'atphase',
  AuraEffect = 'aura',
  OnEnterEffect = 'onenter',
  OnExitEffect = 'onexit',
}

export enum CardSize {
  Small = 'small',
  Medium = 'medium',
  Big = 'big'
}

export enum CardType {
  Charm = 'charm',
  Companion = 'companion',
  Food = 'food',
  Trick = 'trick'
}

export interface CardQueryParams {
  name?: string;
  set?: string;
  type?: CardType;
}

export interface EffectValues {
  main: number;
  strength: number;
  energy: number;
}

export interface CardEffect {
  readonly name: string;
  readonly description: string;
  readonly type: CardEffectType;
  readonly action: GameEffectActionType;
  readonly values: EffectValues;
  readonly phase?: GamePhase;
}

export interface Card {
  readonly id: string;
  readonly type: CardType;
  readonly setId: string;
  readonly name: string;
  readonly description: string;
  readonly imgUrl: string;
  readonly cost?: number;
  readonly effects?: CardEffect[];
  readonly strength?: number;
  readonly energy?: number;
}

// export class CompanionCard implements Card {
//   readonly type = CardType.Companion;

//   constructor(
//     readonly id: string,
//     readonly name: string,
//     readonly setId: string,
//     readonly imgUrl: string,
//     readonly cost: number,
//     readonly effects: CardEffect[],
//     readonly strength: number,
//     readonly energy: number
//   ) {}
// }

// export class CharmCard implements Card {
//   readonly type = CardType.Charm;

//   constructor(
//     readonly id: string,
//     readonly name: string,
//     readonly setId: string,
//     readonly imgUrl: string,
//     readonly cost: number,
//     readonly effects: CardEffect[]
//   ) {}
// }

// export class TrickCard implements Card {
//   readonly type = CardType.Trick;

//   constructor(
//     readonly id: string,
//     readonly name: string,
//     readonly setId: string,
//     readonly imgUrl: string,
//     readonly cost: number,
//     readonly effects: CardEffect[]
//   ) {}
// }

// export class FoodCard implements Card {
//   readonly type = CardType.Food;

//   constructor(
//     readonly id: string,
//     readonly name: string,
//     readonly setId: string,
//     readonly imgUrl: string,
//   ) {}
// }
