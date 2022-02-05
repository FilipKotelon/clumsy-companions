import { AIOpponent } from '@core/ai-opponents/ai-opponents.types';
import { CardEffectType, CardType } from '@core/cards/cards.types';
import { Deck } from '@core/decks/decks.types';
import { Player } from '@core/player/player.types';
import { GameEffect } from './store/game.effect.actions';

export interface EffectValues {
  main: number;
  strength: number;
  energy: number;
}

export interface AuraPayload {
  ownerId: string;
  originId: string;
  values: EffectValues;
}

export enum AuraTarget {
  Allies = 'allies',
  AlliesExcept = 'allies-except',
  AllExcept = 'all-except',
  Enemies = 'enemies'
}

export interface AuraData extends AuraPayload {
  target: AuraTarget;
}

export enum BuffTarget {
  Allies = 'allies',
  Enemies = 'enemies',
  Target = 'target'
}

export interface BuffData {
  positive: boolean;
  target: BuffTarget;
  targetId?: string;
}

export interface GameActiveEffects {
  auras: AuraData[];
  buffs: BuffData[];
}

export interface GameStartRawData {
  player: Player;
  playerDeck: Deck;
  opponent: AIOpponent;
}

export interface PlayerOpponentBundle {
  player: InGamePlayer;
  opponent: InGamePlayer;
}

export interface PlayerOpponentLoadInfo extends PlayerOpponentBundle {
  loaded: boolean;
}

export type PlayerKey = 'player' | 'opponent';

export interface InGameCardEffect {
  readonly name: string;
  readonly description: string;
  readonly type: CardEffectType;
  readonly action: GameEffect;
  readonly values: EffectValues;
}

export interface InGameCard {
  readonly baseCost?: number;
  readonly baseEnergy?: number;
  readonly baseStrength?: number;
  readonly description?: string;
  readonly gameObjectId: string;
  readonly imgUrl: string;
  readonly name: string;
  readonly ownerId: string;
  readonly type: CardType;
  cost?: number;
  currentOwnerId: string;
  dizzy?: boolean;
  effects?: InGameCardEffect[];
  effectedPersonallyBy?: InGameCardEffect[];
  energy?: number;
  strength?: number;
  tired?: boolean;
}

export interface InGamePLayerBaseData {
  readonly baseFood: number;
  hand: InGameCard[];
  sleepyard: SleepyardCard[];
  cardsInPlay: InGameCard[];
  energy: number;
  currentFood: number;
  hasTurn: boolean;
}

export interface InGamePlayer extends InGamePLayerBaseData {
  readonly avatarImgUrl: string;
  readonly gameObjectId: string;
  readonly username: string;
  deck: InGameCard[];
  deckSleeveImgUrl: string;
}

export interface SleepyardCard extends InGameCard {
  turnsLeft: number;
}

export enum TurnPhaseType {
  Preparation = 'preparation',
  Action = 'action'
}

export interface TurnPhase {
  type: TurnPhaseType;
  name: string;
}

//IMPORTANT: Names in the phases are used as keys to get their icons, keep that in mind when changing
export const TURN_PHASES: TurnPhase[] = [
  {
    type: TurnPhaseType.Preparation,
    name: 'preparation'
  },
  {
    type: TurnPhaseType.Action,
    name: 'attack'
  },
  {
    type: TurnPhaseType.Action,
    name: 'defense'
  },
  {
    type: TurnPhaseType.Action,
    name: 'damage'
  },
  {
    type: TurnPhaseType.Preparation,
    name: 'preparation'
  }
];
