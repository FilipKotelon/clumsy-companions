import { GameEffectActionType } from '@core/game/store/game.effect.actions';
import { EffectValues } from '@core/game/game.types';

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
  ids?: string[];
  name?: string;
  set?: string;
  type?: CardType;
  availableInGame?: boolean;
}

export interface CardEffect {
  readonly name: string;
  readonly description: string;
  readonly type: CardEffectType;
  readonly action: string;
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
  readonly availableInGame: boolean;
}

export interface DbCard extends CardMainData {
  readonly dateAdded: Date;
}

export interface Card extends DbCard {
  readonly id: string;
}

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

export const FOOD_CARD_EFFECT: CardEffect = {
  name: 'Food',
  description: 'This card adds 1 Food to your resources.',
  type: CardEffectType.AuraEffect,
  action: GameEffectActionType.ADD_FOOD,
  values: {
    main: 1,
    strength: null,
    energy: null
  }
}
