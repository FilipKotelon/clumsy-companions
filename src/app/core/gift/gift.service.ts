import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { AvatarsService } from '@core/avatars/avatars.service';
import { Avatar } from '@core/avatars/avatars.types';
import { DecksService } from '@core/decks/decks.service';
import { Deck, DeckMainData } from '@core/decks/decks.types';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { delay, map, mergeMap, switchMap } from 'rxjs/operators';

import { Gift, WelcomeBundle } from './gift.types';

@Injectable({
  providedIn: 'root'
})
export class GiftService {
  closedGift = new Subject<Gift[]>();
  giftsToOpen: Gift[] = [];

  constructor(
    private avatarsSvc: AvatarsService,
    private decksSvc: DecksService
  ) { }

  addGift = (gift: Gift): void => {
    this.giftsToOpen.push(gift);
    this.closedGift.next(this.giftsToOpen);
  }

  closeGift = (): void => {
    this.giftsToOpen.pop();
    this.closedGift.next(this.giftsToOpen);
  }

  prepareWelcomeBundle = (): Observable<WelcomeBundle> => {
    const decksGift = {
      title: 'Welcome!',
      description: 'Here are some decks for you to get you started!',
      decks: []
    };

    const coinsGift = {
      title: 'But wait! There is more!',
      description: 'Here are some coins so you can buy yourself some card packs or pretty things!',
      coins: 2500
    };

    const avatarGift = {
      title: 'What? Even more?!',
      description: 'Yup, here\'s a free low effort avatar especially for you!',
      avatar: null
    };

    return combineLatest([
      this.prepareWelcomeAvatar(),
      this.prepareWelcomeDecks()
    ]).pipe(
      map(([avatar, decks]) => {
        decksGift.decks = decks;
        avatarGift.avatar = avatar;

        // Add in reverse order because the last gift is the one that is visible first
        this.addGift(avatarGift);
        this.addGift(coinsGift);
        this.addGift(decksGift);

        return {
          decksGift,
          coinsGift,
          avatarGift
        };
      })
    );
  }

  prepareWelcomeAvatar = (): Observable<Avatar> => {
    return this.avatarsSvc.getAvatars({ names: ['Basic Avatar'] })
      .pipe(
        map(avatars => avatars.length ? avatars[0] : null)
      );
  }

  addWelcomeDeck = (name: string, timeoutMs = 50): Observable<string> => {
    return this.decksSvc.getDecks({
      names: [name],
      global: true
    }).pipe(
      map(deck => deck[0]),
      // Delay the add queries so Firebase can handle it
      delay(timeoutMs),
      switchMap(deck => {
        const { id, global, ...data } = deck;
        
        return this.decksSvc.addDeckToDatabase({
          ...data,
          global: false
        })
      }),
      map(cloneDeckDoc => {
        return cloneDeckDoc.id
      })
    )
  }

  prepareWelcomeDecks = (): Observable<Deck[]> => {
    return this.addWelcomeDeck('Basic Cat Deck').pipe(
      switchMap(firstDeckId => {
        return this.addWelcomeDeck('Basic Dog Deck', 1000).pipe(
          map(secondDeckId => {
            return [firstDeckId, secondDeckId]
          }),
          switchMap((ids) => this.decksSvc.getDecks({ ids }))
        )
      })
    );
  }
}
