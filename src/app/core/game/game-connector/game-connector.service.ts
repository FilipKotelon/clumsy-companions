import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
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

import * as GameStateActions from '@core/game/store/game-state.actions';
import * as fromStore from '@core/store/reducer';
import { switchMap } from 'rxjs/operators';
import { GameEffectMap, getGameEffectsMap } from '../store/game-effect.actions';
import { Router } from '@angular/router';
import { SleevesService } from '@core/sleeves/sleeves.service';
import { GamePlayerService } from '../game-player/game-player.service';
import { shuffleCards } from '../game.helpers';

@Injectable({
  providedIn: 'root'
})
export class GameConnectorService {
  gameEffectsMap: GameEffectMap;
  gameStartModalOpen$ = new Subject<boolean>();

  constructor(
    private avatarsSvc: AvatarsService,
    private cardsSvc: CardsService,
    private decksSvc: DecksService,
    private gameLoaderSvc: GameLoaderService,
    private playerSvc: PlayerService,
    private router: Router,
    private sleeveSvc: SleevesService,
    private store: Store<fromStore.AppState>
  ) {
    this.gameEffectsMap = getGameEffectsMap();
  }

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

  mapToInGameCards = (uniqueCards: Card[], cardsIds: string[], ownerId: string): InGameCard[] => {
    return cardsIds.map(cardId => {
      const { setId, availableInGame, effects, ...inGameCardData } = uniqueCards.find(uCard => uCard.id === cardId);

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
        ...inGameCardEffect,
        action: this.gameEffectsMap[action]
      };
    }));
  }

  getPlayerData = (player: Player, playerDeck: Deck): Observable<InGamePlayer> => {
    const avatarImgUrl$ = this.avatarsSvc.getAvatar(player.currentAvatarId)
      .pipe(
        switchMap(avatar => of(avatar.imgUrl))
      );
    const deckCards$ = this.cardsSvc.getCards({ ids: this.getUniqueCardIds(playerDeck.cardIds) });
    const deckSleeveImgUrl$ = this.sleeveSvc.getSleeve(playerDeck.sleeveId)
      .pipe(
        switchMap(sleeve => of(sleeve.imgUrl))
      );

    return combineLatest([
      avatarImgUrl$,
      deckCards$,
      deckSleeveImgUrl$
    ]).pipe(
      switchMap(([ avatarImgUrl, deckCards, deckSleeveImgUrl ]) => {
        const playerId = this.gameLoaderSvc.getUniqueObjectId();
        return of({
          ...this.getStartInGamePlayerData(),
          avatarImgUrl,
          deck: shuffleCards(this.mapToInGameCards(deckCards, playerDeck.cardIds, playerId)),
          username: player.username,
          gameObjectId: playerId,
          deckSleeveImgUrl
        })
      })
    );
  }

  getOpponentData = (opponent: AIOpponent): Observable<InGamePlayer> => {
    return this.decksSvc.getDeck(opponent.deckId)
      .pipe(
        switchMap(deck => {
          const avatarImgUrl$ = this.avatarsSvc.getAvatar(opponent.avatarId)
            .pipe(
              switchMap(avatar => of(avatar.imgUrl))
            );
          const deckCards$ = this.cardsSvc.getCards({ ids: this.getUniqueCardIds(deck.cardIds) });
          const deckSleeveImgUrl$ = this.sleeveSvc.getSleeve(deck.sleeveId)
            .pipe(
              switchMap(sleeve => of(sleeve.imgUrl))
            );

          return combineLatest([
            avatarImgUrl$,
            deckCards$,
            deckSleeveImgUrl$
          ]).pipe(
            switchMap(([ avatarImgUrl, deckCards, deckSleeveImgUrl ]) => {
              const opponentId = this.gameLoaderSvc.getUniqueObjectId();
              return of({
                ...this.getStartInGamePlayerData(),
                avatarImgUrl,
                deck: shuffleCards(this.mapToInGameCards(deckCards, deck.cardIds, opponentId)),
                username: opponent.name,
                gameObjectId: opponentId,
                deckSleeveImgUrl
              })
            })
          )
        })
      )
  }

  loadPlayers = (data: GameStartRawData): Observable<Action> => {
    return combineLatest([
      this.getPlayerData(data.player, data.playerDeck),
      this.getOpponentData(data.opponent)
    ]).pipe(
      switchMap(([player, opponent]) => {
        //It should load the images for the cards and their sleeves plus the 2 avatars and the background
        this.gameLoaderSvc.setRequiredRegistrations(player.deck.length * 2 + opponent.deck.length * 2 + 3)

        return of(GameStateActions.gameLoadPlayers({ player, opponent }));
      })
    )
  }

  startGame = (data: GameStartRawData): void => {
    this.store.dispatch(GameStateActions.gameLoadStart(data));
  }
}
