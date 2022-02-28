import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { CardFight, CardInPlay } from '../game.types';

import * as fromStore from '@core/store/reducer';
import * as GameStateActions from '@core/game/store/game-state.actions';

@Injectable({
  providedIn: 'root'
})
export class GameFightsService {
  constructor(private store: Store<fromStore.AppState>){}

  resolveFights = (fights: CardFight[], attackers: CardInPlay[], attackedPlayerId: string): void => {
    const attackerIdsInFights = fights.map(fight => fight.attacker.gameObjectId);
    const unblockedAttackers = attackers.filter(card => !attackerIdsInFights.includes(card.gameObjectId));

    this.animateFights(fights);

    if(unblockedAttackers.length){
      this.animateAttackingPlayer(unblockedAttackers, attackedPlayerId);
    }

    setTimeout(() => {
      this.store.dispatch(GameStateActions.gameResolveFightsDamage());
    }, 1000);
  }

  animateFights = (fights: CardFight[]): void => {
    fights.forEach(fight => {
      const attackerEl = document.getElementById(fight.attacker.gameObjectId);
      const defenderEl = document.getElementById(fight.defender.gameObjectId);

      this.animateAttack(attackerEl, defenderEl);
    });
  }

  animateAttackingPlayer = (cards: CardInPlay[], playerId: string): void => {
    const playerEl = document.getElementById(playerId);

    cards.forEach(attacker => {
      const attackerEl = document.getElementById(attacker.gameObjectId);

      if(attackerEl){
        this.animateAttack(attackerEl, playerEl);
      }
    });
  }

  animateAttack = (attackerEl: HTMLElement, targetEl: HTMLElement): void => {
    let attackerElTop = attackerEl.getBoundingClientRect().top;
    let attackerElLeft = attackerEl.getBoundingClientRect().left;
    let targetElTop = targetEl.getBoundingClientRect().top;
    let targetElLeft = targetEl.getBoundingClientRect().left;

    attackerEl.style.top = -(attackerElTop - targetElTop) + 'px';
    attackerEl.style.left = -(attackerElLeft - targetElLeft) + 'px';

    setTimeout(() => {
      attackerEl.style.top = '0px';
      attackerEl.style.left = '0px';
    }, 400);
  }
}
