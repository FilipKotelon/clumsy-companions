import { GameEffectActionType } from './store/game.effect.actions';

export const getCardActionNameFromType = (type: GameEffectActionType): string => {
  switch(type){
    case GameEffectActionType.GAME_EFFECT_AURA_BUFF:
      return 'Buff allies';
    case GameEffectActionType.GAME_EFFECT_AURA_DEBUFF:
      return 'Debuff enemies';
    case GameEffectActionType.GAME_EFFECT_DAMAGE_TARGET:
      return 'Damage enemy companion or player';
    default:
      return null;
  }
}