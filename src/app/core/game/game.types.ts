import { AIOpponent } from '@core/ai-opponents/ai-opponents.types';
import { CardEffectType, CardType } from '@core/cards/cards.types';
import { Deck } from '@core/decks/decks.types';
import { Player } from '@core/player/player.types';
import { GameEffect } from './store/game-effect.actions';

export interface CompanionBaseStats {
  strength: number;
  energy: number;
}

export interface EffectValues extends CompanionBaseStats {
  main: number;
}

export interface EffectBasePayload {
  positive: boolean;
  playerKey: PlayerKey;
  values: EffectValues;
}

export interface AuraPayload extends EffectBasePayload {
  originId: string;
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

export interface BuffData extends EffectBasePayload {
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
  readonly playerKey: PlayerKey;
  readonly type: CardType;
  cost?: number;
  currentPlayerKey: string;
  dizzy?: boolean;
  effects?: InGameCardEffect[];
  effectedPersonallyBy?: BuffData[];
  energy?: number;
  strength?: number;
  tired?: boolean;
}

export interface HandCard extends InGameCard {
  playable: boolean;
}

export interface CardInPlay extends InGameCard {
  attacking: boolean;
  defending: boolean;
}

export interface SleepyardCard extends InGameCard {
  turnsLeft: number;
}

export interface InGamePLayerBaseData {
  readonly baseFood: number;
  hand: HandCard[];
  sleepyard: SleepyardCard[];
  cardsInPlay: CardInPlay[];
  energy: number;
  currentFood: number;
  hasTurn: boolean;
  playedFoodThisTurn: boolean;
}

export interface InGamePlayer extends InGamePLayerBaseData {
  readonly avatarImgUrl: string;
  readonly gameObjectId: string;
  readonly username: string;
  deck: InGameCard[];
  deckSleeveImgUrl: string;
}

export enum TurnPhaseType {
  Preparation = 'preparation',
  Action = 'action'
}

export type TurnPhaseName =
  'preparation-first'
  | 'attack'
  | 'defense'
  | 'damage'
  | 'preparation-last';

export interface TurnPhase {
  type: TurnPhaseType;
  name: TurnPhaseName;
  iconName: string;
}

//IMPORTANT: Names in the phases are used as keys to get their icons, keep that in mind when changing
export const TURN_PHASES: TurnPhase[] = [
  {
    type: TurnPhaseType.Preparation,
    name: 'preparation-first',
    iconName: 'preparation'
  },
  {
    type: TurnPhaseType.Action,
    name: 'attack',
    iconName: 'attack'
  },
  {
    type: TurnPhaseType.Action,
    name: 'defense',
    iconName: 'defense'
  },
  {
    type: TurnPhaseType.Action,
    name: 'damage',
    iconName: 'damage'
  },
  {
    type: TurnPhaseType.Preparation,
    name: 'preparation-last',
    iconName: 'preparation'
  }
];

export interface InGameTurnPhase extends TurnPhase {
  active: boolean;
}

export enum TurnPhaseButtonActionType {
  ApproveContinuation,
  EndTurn,
  None,
  NextPhase,
  SkipTo
}

export interface TurnPhaseButtonActionPayload {
  actionType: TurnPhaseButtonActionType;
  phaseName?: TurnPhaseName;
}

export interface ContinuationApproval {
  player: boolean;
  opponent: boolean;
}

export interface CounterPlayStatus {
  playerKey: PlayerKey;
  canCounter: boolean;
}
