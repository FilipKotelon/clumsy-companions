import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AuthService } from '@core/auth/auth.service';

import * as fromStore from '@core/store/reducer';
import * as PlayerSelectors from '@core/player/store/player.selectors';

import { DbUser } from '@core/auth/auth.types';
import { Player } from './player.types';
import { Pack } from '../packs/packs.types';
import { MessageService } from '../message/message.service';
import { ShopProduct } from '../shop/shop.types';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playerDocRef: AngularFirestoreDocument<DbUser>;

  constructor(
    private authSvc: AuthService,
    private fireStore: AngularFirestore,
    private messageSvc: MessageService,
    private store: Store<fromStore.AppState>
  ) {
    this.authSvc.getUser().subscribe(user => {
      this.playerDocRef = this.fireStore.collection<DbUser>('users').doc(user.dbId);
    })
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

  getOwnedPacksIds = (): Observable<string[]> => {
    return this.getPlayer().pipe(
      switchMap(player => {
        return of(player.ownedPacksIds);
      })
    );
  }

  purchasePack = (pack: Pack, amount: number): void => {
    const totalPrice = pack.price * amount;

    this.getPlayer().pipe(
      take(1)
    ).subscribe(player => {
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
    })
  }
}
