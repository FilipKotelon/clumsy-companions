import { GameEffectActionType } from './store/game.effect.actions';

export const getCardActionNameFromType = (type: GameEffectActionType): string => {
  switch(type){
    case GameEffectActionType.GAME_EFFECT_DESTROY_TARGET:
      return 'Destroy a companion';
    case GameEffectActionType.GAME_EFFECT_DESTROY_ALL:
      return 'Destroy all companions';
    case GameEffectActionType.GAME_EFFECT_DESTROY_ALL_EXCEPT:
      return 'Damage all companions but this one';

    case GameEffectActionType.GAME_EFFECT_DAMAGE_TARGET:
      return 'Damage a companion or player';
    case GameEffectActionType.GAME_EFFECT_DAMAGE_ENEMIES:
      return 'Damage enemies';
    case GameEffectActionType.GAME_EFFECT_DAMAGE_ALL:
      return 'Damage all companions';
    case GameEffectActionType.GAME_EFFECT_DAMAGE_ALL_EXCEPT:
      return 'Damage all companions but this one';

    case GameEffectActionType.GAME_EFFECT_BUFF_TARGET:
      return 'Buff target until end of turn';
    case GameEffectActionType.GAME_EFFECT_BUFF_ALLIES:
      return 'Buff allies until end of turn';

    case GameEffectActionType.GAME_EFFECT_DEBUFF_TARGET:
      return 'Debuff target until end of turn';
    case GameEffectActionType.GAME_EFFECT_DEBUFF_ENEMIES:
      return 'Debuff enemies until end of turn';

    case GameEffectActionType.GAME_EFFECT_AURA_BUFF_ALLIES:
      return 'Buff allies';
    case GameEffectActionType.GAME_EFFECT_AURA_BUFF_ALLIES_EXCEPT:
      return 'Buff your other companions';

    case GameEffectActionType.GAME_EFFECT_AURA_DEBUFF_ENEMIES:
      return 'Debuff enemies';
    case GameEffectActionType.GAME_EFFECT_AURA_DEBUFF_ALL_EXCEPT:
      return 'Debuff all companions but this one';

    case GameEffectActionType.GAME_EFFECT_HEAL_PLAYER:
      return 'Heal Player';

    case GameEffectActionType.GAME_EFFECT_ADD_FOOD:
      return 'Add Food';

    default:
      return null;
  }
}