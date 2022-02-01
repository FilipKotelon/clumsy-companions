import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subject } from 'rxjs';

import { AIOpponent } from '@core/ai-opponents/ai-opponents.types';
import { AvatarsService } from '@core/avatars/avatars.service';
import { CardsService } from '@core/cards/cards.service';
import { Card, CardEffect } from '@core/cards/cards.types';
import { DecksService } from '@core/decks/decks.service';
import { Deck } from '@core/decks/decks.types';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';
import { GameStartRawData, InGameCard, InGameCardEffect, InGamePlayer, InGamePLayerBaseData } from '@core/game/game.types';
import { Player, PLAYER_SETTINGS } from '@core/player/player.types';
import { PlayerService } from '@core/player/player.service';

import * as GameStateActions from '@core/game/store/game.state.actions';
import * as fromStore from '@core/store/reducer';
import { map } from '@firebase/util';
import { switchMap } from 'rxjs/operators';
import { GAME_EFFECTS_MAP } from '../store/game.effect.actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameConnectorService {
  gameStartModalOpen$ = new Subject<boolean>();

  constructor(
    private avatarsSvc: AvatarsService,
    private cardsSvc: CardsService,
    private decksSvc: DecksService,
    private gameLoaderSvc: GameLoaderService,
    private playerSvc: PlayerService,
    private router: Router,
    private store: Store<fromStore.AppState>
  ) { }

  closeGameStartModal = (): void => {
    this.gameStartModalOpen$.next(false);
  }

  openGameStartModal = (): void => {
    this.gameStartModalOpen$.next(true);
  }

  getStartInGamePlayerData = (): InGamePLayerBaseData => {
    return {
      baseFood: PLAYER_SETTINGS.BASE_FOOD,
      hand: [],
      sleepyard: [],
      cardsInPlay: [],
      energy: PLAYER_SETTINGS.BASE_ENERGY,
      currentFood: PLAYER_SETTINGS.BASE_FOOD,
      hasTurn: false
    }
  }

  getUniqueCardIds = (cardIds: string[]): string[] => {
    return cardIds.reduce((prev, cur) => {
      if(!prev.includes(cur)){
        prev.push(cur);
      }

      return prev;
    }, []);
  }

  mapToInGameCards = (cards: Card[], ownerId: string): InGameCard[] => {
    return cards.map(card => {
      const { setId, availableInGame, effects, ...inGameCardData } = card;

      return {
        ...inGameCardData,
        baseCost: inGameCardData.cost,
        baseEnergy: inGameCardData.energy,
        baseStrength: inGameCardData.strength,
        gameObjectId: this.gameLoaderSvc.getUniqueObjectId(),
        ownerId,
        currentOwnerId: ownerId,
        dizzy: false,
        effects: this.mapToInGameCardEffects(effects),
        effectedPersonallyBy: [],
        tired: false
      }
    })
  }

  mapToInGameCardEffects = (effects: CardEffect[]): InGameCardEffect[] => {
    return effects.map((effect => {
      const { action, ...inGameCardEffect } = effect;

      return {
        ...effect,
        action: GAME_EFFECTS_MAP[action]
      };
    }));
  }

  getPlayerData = (player: Player, playerDeck: Deck): Observable<InGamePlayer> => {
    return this.playerSvc.getPlayer()
      .pipe(
        switchMap(player => {
          const avatarImgUrl$ = this.avatarsSvc.getAvatar(player.currentAvatarId)
            .pipe(
              switchMap(avatar => {
                return of(avatar.imgUrl);
              })
            );
          const deckCards$ = this.cardsSvc.getCards({ ids: this.getUniqueCardIds(playerDeck.cardIds) });
    
          return combineLatest([
            avatarImgUrl$,
            deckCards$
          ]).pipe(
            switchMap(([ avatarImgUrl, deckCards ]) => {
              const playerId = this.gameLoaderSvc.getUniqueObjectId();
              return of({
                ...this.getStartInGamePlayerData(),
                avatarImgUrl,
                deck: this.mapToInGameCards(deckCards, playerId),
                username: player.username,
                gameObjectId: playerId
              })
            })
          )
        }
      )
    );
  }

  getOpponentData = (opponent: AIOpponent): Observable<InGamePlayer> => {
    return this.decksSvc.getDeck(opponent.deckId)
      .pipe(
        switchMap(deck => {
          const avatarImgUrl$ = this.avatarsSvc.getAvatar(opponent.avatarId)
            .pipe(
              switchMap(avatar => {
                return of(avatar.imgUrl);
              })
            );
          const deckCards$ = this.cardsSvc.getCards({ ids: this.getUniqueCardIds(deck.cardIds) });

          return combineLatest([
            avatarImgUrl$,
            deckCards$
          ]).pipe(
            switchMap(([ avatarImgUrl, deckCards ]) => {
              const opponentId = this.gameLoaderSvc.getUniqueObjectId();
              return of({
                ...this.getStartInGamePlayerData(),
                avatarImgUrl,
                deck: this.mapToInGameCards(deckCards, opponentId),
                username: opponent.name,
                gameObjectId: opponentId
              })
            })
          )
        })
      )
  }

  startGame = (data: GameStartRawData): void => {
    this.store.dispatch(GameStateActions.gameLoadStart());
    this.router.navigate(['/game/']);

    combineLatest([
      this.getPlayerData(data.player, data.playerDeck),
      this.getOpponentData(data.opponent),
      this.gameLoaderSvc.loadingFinished$
    ]).subscribe(([player, opponent, loaded]) => {
      
    })
  }
}
