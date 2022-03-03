import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as GameEffectActions from '@core/game/store/game-effect.actions';
import * as GameStateActions from '@core/game/store/game-state.actions';
import { CardFight, CardInPlay, HandCard, PlayerKey } from '../game.types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamePlayerService {
  private _playerPredeclaredDefender: CardInPlay = null;
  readonly playerPredeclaredDefender$ = new Subject<CardInPlay>();

  constructor(private store: Store<fromStore.AppState>) { }

  approveContinuation = (playerKey: PlayerKey): void => {
    this.store.dispatch(GameStateActions.gameApproveContinuation({ playerKey }));
  }

  chooseAttackers = (cards: CardInPlay[], playerKey: PlayerKey): void => {
    this.store.dispatch(GameStateActions.gameChooseAttackers({ cards, playerKey }));
  }

  predeclareDefender = (card: CardInPlay): void => {
    this._playerPredeclaredDefender = card;
    this.playerPredeclaredDefender$.next(this._playerPredeclaredDefender);
  }

  clearPredeclaredDefender = (): void => {
    this._playerPredeclaredDefender = null;
    this.playerPredeclaredDefender$.next(this._playerPredeclaredDefender);
  }

  chooseFightsInDefense = (fights: CardFight[], playerKey: PlayerKey): void => {
    this.store.dispatch(GameStateActions.gameChooseFightsInDefense({ fights, playerKey }));
  }

  drawXCards = (x: number, playerKey: PlayerKey): void => {
    this.store.dispatch(GameEffectActions.gameDrawXCards({ amount: x, playerKey }));
  }
  
  playCard = (card: HandCard, playerKey: PlayerKey): void => {
    this.store.dispatch(GameStateActions.gamePlayCard({ card, playerKey }));
  }

  shuffleDeck = (playerKey: PlayerKey): void => {
    this.store.dispatch(GameEffectActions.gameShuffleDeck({ playerKey }));
  }

  provideTargetForEffect = (targetId: string): void => {
    this.store.dispatch(GameStateActions.gameProvideTargetForEffect({ targetId }));
  }
}
