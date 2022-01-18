import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { CardType, FOOD_CARD_EFFECT } from '@core/cards/cards.types';

import { CardEffect, CardEffectType } from '@core/cards/cards.types';
import { GameEffectActionType } from '@core/game/store/game.effect.actions';

import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-card-effect',
  templateUrl: './card-effect.component.html',
  animations: [
    fadeInOut
  ]
})
export class CardEffectComponent implements OnInit {
  @Input() effect: CardEffect;
  @Input() cardType?: CardType;

  effectIcon: string;
  open: boolean;

  ngOnInit(): void {
    if(this.cardType && this.cardType === CardType.Food){
      this.effect = FOOD_CARD_EFFECT;
    }

    this.effectIcon = this.getEffectIconName();
  }

  getEffectIconName = (): string => {
    const type = this.cardType ? this.cardType : this.effect.type;

    if(type === CardType.Food){
      return `${type}`;
    }

    const action = this.effect.action;
    let additional = '';

    if(type === CardEffectType.AuraEffect){
      if(action === GameEffectActionType.GAME_EFFECT_AURA_BUFF_ALLIES || action === GameEffectActionType.GAME_EFFECT_AURA_BUFF_ALLIES_EXCEPT){
        additional = '-buff';
      } else if(action === GameEffectActionType.GAME_EFFECT_AURA_DEBUFF_ENEMIES || action === GameEffectActionType.GAME_EFFECT_AURA_DEBUFF_ALL_EXCEPT){
        additional = '-debuff';
      }
    }

    return `${type}${additional}`;
  }

  onOpen = (): void => {
    this.open = true;
  }

  onClose = (): void => {
    this.open = false;
  }
}
