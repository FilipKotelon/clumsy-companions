import { GameEffectActionType } from '@core/game/store/game.effect.actions';

export const CARD_SETTINGS = {
  MIN_COST: 1,
  MAX_COST: 8,
  MIN_STRENGTH: 0,
  MAX_STRENGTH: 8,
  MIN_ENERGY: 1,
  MAX_ENERGY: 10,
  MIN_EFFECT_VALUE: 1,
  MAX_EFFECT_VALUE: 10
}

export enum CardEffectType {
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
}

export interface CardMainData {
  readonly type: CardType;
  readonly setId: string;
  readonly name: string;
  readonly description?: string;
  readonly imgUrl: string;
  readonly cost?: number;
  readonly effects?: CardEffect[];
  readonly strength?: number;
  readonly energy?: number;
}

export interface DbCard extends CardMainData {
  readonly dateAdded: Date;
}

export interface Card extends DbCard {
  readonly id: string;
}

export interface CardUpdateData {

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
