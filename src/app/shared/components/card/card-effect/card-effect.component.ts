import { fadeInOut } from '@shared/animations/component-animations';
import { CardType } from '@core/cards/cards.types';
import { Component, Input, OnInit } from '@angular/core';
import { CardEffect, CardEffectType } from '@core/cards/cards.types';

import * as GameEffectActions from '@core/game/store/game.effect.actions';

@Component({
  selector: 'app-card-effect',
  templateUrl: './card-effect.component.html',
  styleUrls: ['./card-effect.component.scss'],
  animations: [
    fadeInOut
  ]
})
export class CardEffectComponent implements OnInit {
  @Input() open: boolean;
  @Input() effect: CardEffect;
  @Input() cardType?: CardType;

  effectIcon: string;

  ngOnInit(): void {
    this.effectIcon = this.getEffectIconName();
  }

  getEffectIconName = (): string => {
    const type = this.cardType ? this.cardType : this.effect.effectType;
    const action = this.effect.effectAction;
    let additional = '';

    if(type === CardEffectType.AuraEffect){
      if(action === GameEffectActions.GAME_EFFECT_AURA_BUFF){
        additional = '-buff';
      } else if(action === GameEffectActions.GAME_EFFECT_AURA_DEBUFF){
        additional = '-debuff';
      }
    }

    return `${type}${additional}`
  }
}
