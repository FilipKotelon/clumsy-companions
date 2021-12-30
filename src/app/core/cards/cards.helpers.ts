import { CardEffectType } from './cards.types';

export const getCardEffectNameFromType = (type: CardEffectType): string => {
  switch(type){
    case CardEffectType.AuraEffect:
      return 'Aura';
    case CardEffectType.OnEnterEffect:
      return 'Effect on enter';
    case CardEffectType.OnExitEffect:
      return 'Effect on exit';
    default:
      return null;
  }
}