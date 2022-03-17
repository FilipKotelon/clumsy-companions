import { CardInPlay, CardPlayableCheckFullPayload, CardPlayableCheckPayload, CompanionBaseStats, ContinuationApproval, CounterPlayStatus, EffectBasePayload, EffectValues, GameActiveEffects, HandCard, InGameCard, InGamePlayer, PlayerKey, PlayerKeyAndCardPayload, TURN_PHASES } from './game.types';
import * as fromGame from '@core/game/store/game.reducer';
import { CardType } from '@core/cards/cards.types';
import { GameEffectActionType } from './store/game-effect.actions';

export const getEmptyPlayer = (): InGamePlayer => {
  return {
    baseFood: null,
    hand: [],
    sleepyard: [],
    cardsInPlay: [],
    energy: null,
    currentFood: null,
    avatarImgUrl: null,
    gameObjectId: null,
    username: null,
    deck: [],
    deckSleeveImgUrl: null,
    playedFoodThisTurn: false
  }
}

export const getCardPlayableCheckPayload = (draft: fromGame.State, pcPayload: PlayerKeyAndCardPayload): CardPlayableCheckPayload => {
  const hasTurn = draft.currentPlayerKey === pcPayload.playerKey;
  let canCounter = false;

  if(!hasTurn){
    if(pcPayload.card && pcPayload.card.type !== CardType.Food && draft.counterPlayStatus.playerKey === getOtherPlayerKey(pcPayload.playerKey) && draft.counterPlayStatus.canCounter){
      canCounter = true;
    }

    if(draft.turnPhaseIndex === 2){
      canCounter = true;
    }
  }

  if(hasTurn && draft.counterPlayStatus.playerKey === draft.currentPlayerKey && draft.counterPlayStatus.canCounter){
    canCounter = true;
  }

  return {
    player: draft[pcPayload.playerKey],
    otherPlayer: draft[getOtherPlayerKey(pcPayload.playerKey)],
    turnPhaseIndex: draft.turnPhaseIndex,
    hasTurn,
    canCounter,
    cardsInQueue: draft.cardsQueue.length > 0,
    transitioning: draft.transitioning
  }
}

export const getIsCardPlayable = (payload: CardPlayableCheckFullPayload): boolean => {
  const { card, player, otherPlayer, turnPhaseIndex, hasTurn, canCounter, cardsInQueue, transitioning } = payload;
  const turnPhase = TURN_PHASES[turnPhaseIndex];
  let cardTypes: CardType[] = [];
  let canPayForCost = false;

  if(transitioning){
    return false;
  }

  if(!hasTurn && !canCounter) {
    return false;
  }

  if(card.cost && card.cost <= player.currentFood){
    canPayForCost = true;
  }

  if(turnPhase.type === 'action' || canCounter){
    cardTypes = [CardType.Trick];
  } else {
    cardTypes = [CardType.Food, CardType.Charm, CardType.Companion, CardType.Trick];
  }

  if(card.type === CardType.Food){
    return cardTypes.includes(card.type) && !player.playedFoodThisTurn;
  }

  if(card.type === CardType.Charm || card.type === CardType.Trick){
    const charmRequirements = card.type === CardType.Charm && cardTypes.includes(card.type) && canPayForCost && hasTurn;
    const trickRequirements = card.type === CardType.Trick && cardTypes.includes(card.type) && canPayForCost && (canCounter || hasTurn);

    if(getEffectNeedsEnemyTarget(card.effects[0].action.type)){
      return (charmRequirements || trickRequirements) && otherPlayer.cardsInPlay.length > 0;
    }

    if(getEffectNeedsFriendlyTarget(card.effects[0].action.type)){
      return (charmRequirements || trickRequirements) && player.cardsInPlay.length > 0;
    }
  }

  return cardTypes.includes(card.type) && canPayForCost;
}

export const getResetContinuationApproval = (): ContinuationApproval => ({
  player: true,
  opponent: true
});

export const getResetCounterPlayStatus = (): CounterPlayStatus => ({
  playerKey: null,
  canCounter: false
});

export const getOtherPlayerKey = (playerKey: PlayerKey): PlayerKey => {
  if(playerKey === 'opponent') return 'player';
  return 'opponent';
}

export const getHasPlayableCards = (hand: HandCard[], payload: CardPlayableCheckPayload): boolean => {
  if(payload.transitioning){
    return false;
  }
  return hand.some(card => getIsCardPlayable({ ...payload, card }));
}

export const getValuesFromEffect = (effect: EffectBasePayload): CompanionBaseStats => {
  const values: CompanionBaseStats = {
    energy: 0,
    strength: 0
  };

  if(effect.values.main){
    values.energy = effect.values.main;
    values.strength = effect.values.main;
  }

  if(effect.values.energy){
    values.energy = effect.values.energy;
  }

  if(effect.values.strength){
    values.strength = effect.values.strength;
  }

  return values;
}

export const pipeCompanion = (card: CardInPlay, activeEffects: GameActiveEffects): CardInPlay => {
  if(activeEffects.auras.length){
    activeEffects.auras.forEach(aura => {
      if((aura.playerKey === card.playerKey && aura.target === 'allies')
        || (aura.playerKey === card.playerKey && aura.target === 'allies-except' && aura.originId !== card.gameObjectId)
        || (aura.target === 'all-except' && aura.originId !== card.gameObjectId)
        || (aura.playerKey !== card.playerKey && aura.target === 'enemies')) {
        const values = getValuesFromEffect(aura);
  
        if(aura.positive){
          card.energy += values.energy;
          card.strength += values.strength;
        } else {
          card.energy -= values.energy;
          card.strength -= values.strength;
        }
      }
    });
  }

  if(activeEffects.buffs.length){
    activeEffects.buffs.forEach(buff => {
      if((buff.playerKey === card.playerKey && buff.target === 'allies')
        || (buff.playerKey !== card.playerKey && buff.target === 'enemies')
        || (buff.targetId && buff.targetId === card.gameObjectId)) {
        const values = getValuesFromEffect(buff);
  
        if(buff.positive){
          card.energy += values.energy;
          card.strength += values.strength;
        } else {
          card.energy -= values.energy;
          card.strength -= values.strength;
        }
      }
    });
  }

  return card;
}

const simpleShuffleCards = (cards: InGameCard[]): InGameCard[] => {
  let shuffledCards = [...cards];
  let currentIndex = shuffledCards.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffledCards[currentIndex], shuffledCards[randomIndex]] = [shuffledCards[randomIndex], shuffledCards[currentIndex]];
  }

  return shuffledCards;
}

export const shuffleCards = (cards: InGameCard[]): InGameCard[] => {
  let shuffledCards = cards;

  for(let i = 0; i < 5; i++){
    shuffledCards = simpleShuffleCards(shuffledCards);
  }

  return shuffledCards;
}

export const getEffectNeedsEnemyTarget = (effectType: GameEffectActionType): boolean => {
  return [GameEffectActionType.DESTROY_TARGET,
    GameEffectActionType.DAMAGE_TARGET,
    GameEffectActionType.DEBUFF_TARGET].includes(effectType);
}

export const getEffectNeedsFriendlyTarget = (effectType: GameEffectActionType): boolean => {
  return effectType === GameEffectActionType.BUFF_TARGET;
}

export const getEffectNeedsTarget = (effectType: GameEffectActionType): boolean => {
  return getEffectNeedsEnemyTarget(effectType) || getEffectNeedsFriendlyTarget(effectType);
}

export const getEffectValues = (values: Partial<EffectValues>): EffectValues => ({
  main: 0,
  energy: 0,
  strength: 0,
  ...values
});
