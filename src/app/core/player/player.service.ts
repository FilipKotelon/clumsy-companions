import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AuthService } from '@core/auth/auth.service';

import { DbUser } from '@core/auth/auth.types';
import { Pack, PackWithAmount } from '@core/packs/packs.types';
import { MessageService } from '@core/message/message.service';
import { PacksService } from '@core/packs/packs.service';

import { Player } from './player.types';
import { GiftService } from '../gift/gift.service';
import { LoadingService } from '../loading/loading.service';
import { Deck } from '@core/decks/decks.types';
import { Sleeve } from '@core/sleeves/sleeves.types';
import { SleevesService } from '@core/sleeves/sleeves.service';
import { DecksService } from '@core/decks/decks.service';
import { Gift } from '@core/gift/gift.types';
import { Avatar } from '@core/avatars/avatars.types';
import { AvatarsService } from '@core/avatars/avatars.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  _playerDocRef: AngularFirestoreDocument<DbUser>;

  constructor(
    private avatarsSvc: AvatarsService,
    private authSvc: AuthService,
    private fireStore: AngularFirestore,
    private giftSvc: GiftService,
    private loadingSvc: LoadingService,
    private messageSvc: MessageService,
    private packsSvc: PacksService,
    private sleevesSvc: SleevesService
  ) {
    this.authSvc.getUser().subscribe(user => {
      if(user){
        this.playerDocRef = this.fireStore.collection<DbUser>('users').doc(user.dbId);
      }
    });
  }

  get playerDocRef() {
    return this._playerDocRef;
  }

  private set playerDocRef(doc: AngularFirestoreDocument<DbUser>) {
    this._playerDocRef = doc;
  }

  getPlayer = (): Observable<Player> => {
    if(this.playerDocRef){
      return this.playerDocRef.valueChanges().pipe(
        switchMap(user => {
          let {
            id,
            ...playerProperties
          } = user;
          
          return of({...playerProperties})
        })
      );
    }

    return of(null);
  }

  getCoins = (): Observable<number> => {
    return this.getPlayer().pipe(
      switchMap(player => {
        return of(player.coins);
      })
    );
  }

  getDecksIds = (): Observable<string[]> => {
    return this.getPlayer().pipe(
      switchMap(player => {
        return of(player.decksIds);
      })
    );
  }

  getCurrentDeckId = (): Observable<string> => {
    return this.getPlayer().pipe(
      switchMap(player => {
        return of(player.currentDeckId);
      })
    );
  }

  getOwnedCardsIds = (): Observable<string[]> => {
    return this.getPlayer().pipe(
      switchMap(player => {
        return of(player.ownedCardsIds);
      })
    );
  }

  getOwnedPacksIds = (): Observable<string[]> => {
    return this.getPlayer().pipe(
      switchMap(player => {
        return of(player.ownedPacksIds);
      })
    );
  }

  getOwnedPacks = (): Observable<PackWithAmount[]> => {
    return this.getOwnedPacksIds().pipe(
      switchMap(packsIds => {
        if(!packsIds.length) return of([]);

        //Sort them so they always appear in the same order
        const sortedPacksIds = packsIds.sort((a, b) => {
          if(a < b) return -1;
          if(a > b) return 1;
          return 0;
        });

        const uniquePacksIds: {[key: string]: number} = sortedPacksIds.reduce((prev, cur) => {
          prev[cur] = prev[cur] ? prev[cur] + 1 : 1;
          return prev;
        }, {})

        return this.packsSvc.getPacks({ ids: Object.keys(uniquePacksIds) })
          .pipe(
            switchMap(packs => {
              return of(
                packs.map(pack => ({
                  ...pack,
                  amount: uniquePacksIds[pack.id]
                }))
              );
            })
          );
      })
    );
  }

  getOwnedSleevesIds = (): Observable<string[]> => {
    return this.getPlayer().pipe(
      switchMap(player => {
        return of(player.ownedSleevesIds);
      })
    );
  }

  getOwnedSleeves = (): Observable<Sleeve[]> => {
    return this.getOwnedSleevesIds().pipe(
      switchMap(sleevesIds => {
        if(sleevesIds.length){
          return this.sleevesSvc.getSleeves({ ids: sleevesIds });
        } else {
          return [];
        }
      })
    );
  }

  getOwnedAvatarsIds = (): Observable<string[]> => {
    return this.getPlayer().pipe(
      switchMap(player => {
        return of(player.ownedAvatarsIds);
      })
    );
  }

  getOwnedAvatars = (): Observable<Avatar[]> => {
    return this.getOwnedAvatarsIds().pipe(
      switchMap(avatarsIds => {
        if(avatarsIds.length){
          return this.avatarsSvc.getAvatars({ ids: avatarsIds });
        } else {
          return [];
        }
      })
    );
  }

  purchasePack = (pack: Pack, amount: number): void => {
    const totalPrice = pack.price * amount;

    this.getPlayer()
      .pipe(take(1))
      .subscribe(player => {
        if(player.coins >= totalPrice){
          let packsToAdd: string[] = [];

          for(let i = 0; i < amount; i++){
            packsToAdd.push(pack.id);
          }

          this.playerDocRef.update({
            coins: player.coins - totalPrice,
            ownedPacksIds: [...player.ownedPacksIds, ...packsToAdd]
          }).then(() => {
            this.messageSvc.displayInfo(`Pack${packsToAdd.length > 1 ? 's' : ''} purchased successfully!`);
          }).catch(error => {
            console.log(error);
            this.messageSvc.displayError(`Something went wrong! We will try to refund the coins. If you don't get your coins back within a few minutes, please contact us!`);

            this.playerDocRef.update({
              coins: player.coins
            }).catch(error => {
              console.log(error);
              this.messageSvc.displayError(`Refunding coins failed! We are so sorry, please contact us to get them back!`);
            })
          })
        } else {
          this.messageSvc.displayError(`You don't have enough coins for this purchase.`);
        }
      });
  }

  purchaseAvatar = (avatar: Avatar): void => {
    this.getPlayer()
      .pipe(take(1))
      .subscribe(player => {
        if(player.coins >= avatar.price){
          this.playerDocRef.update({
            coins: player.coins - avatar.price,
            ownedAvatarsIds: [...player.ownedAvatarsIds, avatar.id]
          }).then(() => {
            this.messageSvc.displayInfo(`Avatar purchased successfully!`);
          }).catch(error => {
            console.log(error);
            this.messageSvc.displayError(`Something went wrong! We will try to refund the coins. If you don't get your coins back within a few minutes, please contact us!`);

            this.playerDocRef.update({
              coins: player.coins
            }).catch(error => {
              console.log(error);
              this.messageSvc.displayError(`Refunding coins failed! We are so sorry, please contact us to get them back!`);
            })
          })
        } else {
          this.messageSvc.displayError(`You don't have enough coins for this purchase.`);
        }
      });
  }

  purchaseSleeve = (sleeve: Sleeve): void => {
    this.getPlayer()
      .pipe(take(1))
      .subscribe(player => {
        if(player.coins >= sleeve.price){
          this.playerDocRef.update({
            coins: player.coins - sleeve.price,
            ownedSleevesIds: [...player.ownedSleevesIds, sleeve.id]
          }).then(() => {
            this.messageSvc.displayInfo(`Sleeve purchased successfully!`);
          }).catch(error => {
            console.log(error);
            this.messageSvc.displayError(`Something went wrong! We will try to refund the coins. If you don't get your coins back within a few minutes, please contact us!`);

            this.playerDocRef.update({
              coins: player.coins
            }).catch(error => {
              console.log(error);
              this.messageSvc.displayError(`Refunding coins failed! We are so sorry, please contact us to get them back!`);
            })
          })
        } else {
          this.messageSvc.displayError(`You don't have enough coins for this purchase.`);
        }
      });
  }

  openPack = (pack: Pack): void => {
    this.loadingSvc.addLoadingTask('PLAYER_OPEN_PACK');

    this.getPlayer()
      .pipe(take(1))
      .subscribe(player => {
        this.packsSvc
          .openPack(pack, player.ownedCardsIds)
          .subscribe(gift => {
            const receivedGiftData: Partial<DbUser> = {};
            const packsIds = [...player.ownedPacksIds];
            packsIds.splice(packsIds.indexOf(pack.id), 1);
            receivedGiftData.ownedPacksIds = packsIds;

            if(gift.cards) receivedGiftData.ownedCardsIds = [...player.ownedCardsIds, ...gift.cards.map(card => card.id)];
            if(gift.coins) receivedGiftData.coins = player.coins + gift.coins;
            if(gift.decks) receivedGiftData.decksIds = [...player.decksIds, ...gift.decks.map(deck => deck.id)];
            if(gift.packs) receivedGiftData.ownedPacksIds = [...packsIds, ...gift.packs.map(pack => pack.id)];

            this.giftSvc.addGift(gift);

            this.playerDocRef
              .update(receivedGiftData)
              .catch(e => {
                console.log(e);
                this.messageSvc.displayError('Something went wrong while giving you your new items. If they are missing from your account, inform us immediately.');
              })
              .finally(() => {
                this.loadingSvc.removeLoadingTask('PLAYER_OPEN_PACK');
              });
          });
      });
  }

  receiveGift = (gift: Gift): void => {
    this.loadingSvc.addLoadingTask('PLAYER_RECEIVE_GIFT');

    this.getPlayer()
      .pipe(take(1))
      .subscribe(player => {
        const receivedGiftData: Partial<DbUser> = {};

        if(gift.cards) receivedGiftData.ownedCardsIds = [...player.ownedCardsIds, ...gift.cards.map(card => card.id)];
        if(gift.coins) receivedGiftData.coins = player.coins + gift.coins;
        if(gift.decks) receivedGiftData.decksIds = [...player.decksIds, ...gift.decks.map(deck => deck.id)];
        if(gift.packs) receivedGiftData.ownedPacksIds = [...player.ownedPacksIds, ...gift.packs.map(pack => pack.id)];

        this.giftSvc.addGift(gift);

        this.playerDocRef
          .update(receivedGiftData)
          .catch(e => {
            console.log(e);
            this.messageSvc.displayError('Something went wrong while giving you your new items. If they are missing from your account, inform us immediately.');
          })
          .finally(() => {
            this.loadingSvc.removeLoadingTask('PLAYER_RECEIVE_GIFT');
          });
      });
  }

  assignDeck = (deckId: string, callback?: Function): void => {
    this.getPlayer()
      .pipe(take(1))
      .subscribe(player => {
        let decksIds = [];

        if(player.decksIds && player.decksIds.length) {
          decksIds = [...player.decksIds, deckId];
        } else {
          decksIds = [deckId];
        }

        const playerUpdateData: Partial<Player> = { decksIds };

        if(decksIds.length === 1) {
          playerUpdateData.currentDeckId = deckId;
        }

        this.playerDocRef
          .update(playerUpdateData)
          .then(() => {
            if(callback) callback();
          })
          .catch(e => {
            this.messageSvc.displayError('Something went wrong while assigning the deck to your account. If it is missing from your account, inform us immediately.');
          })
      });
  }

  removeDeck = (deckId: string, callback?: Function) => {
    this.getPlayer()
      .pipe(take(1))
      .subscribe(player => {
        const decksIds = player.decksIds.filter(playerDeckId => playerDeckId !== deckId);

        this.playerDocRef
          .update({ decksIds })
          .then(() => {
            if(callback) callback();
          })
          .catch(e => {
            this.messageSvc.displayError('Something went wrong while removing the deck from your account.');
          })
      })
  }

  chooseCurrentDeck = (id: string): void => {
    this.getDecksIds().pipe(
      take(1)
    ).subscribe(decksIds => {
      if(decksIds.includes(id)){
        this.playerDocRef.update({
          currentDeckId: id
        })
        .catch(e => {
          console.log(e);
          this.messageSvc.displayError('An error occurred while changing the current deck!');
        })
      }
    });
  }

  chooseCurrentAvatar = (id: string): void => {
    this.getOwnedAvatarsIds().pipe(
      take(1)
    ).subscribe(avatarsIds => {
      if(avatarsIds.includes(id)){
        this.playerDocRef.update({
          currentAvatarId: id
        })
        .catch(e => {
          console.log(e);
          this.messageSvc.displayError('An error occurred while changing the current avatar!');
        })
      }
    });
  }
}
