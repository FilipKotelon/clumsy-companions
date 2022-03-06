import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Card } from '@core/cards/cards.types';
import { CardsService } from '@core/cards/cards.service';
import { FilesService } from '@core/files/files.service';
import { Gift } from '@core/gift/gift.types';
import { MessageService } from '@core/message/message.service';

import { Pack, PackMainData, PackQueryParams, PACKS_SETTINGS } from './packs.types';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';

@Injectable({
  providedIn: 'root'
})
export class PacksService {
  constructor(
    private cardsSvc: CardsService,
    private fireStore: AngularFirestore,
    private filesSvc: FilesService,
    private messageSvc: MessageService,
    private router: Router,
  ) { }

  getPacks = (params: PackQueryParams = {}): Observable<Pack[]> => {
    if(params.ids && params.ids.length){
      const docRefs = params.ids.map(id => this.fireStore.collection<PackMainData>('packs').doc(id).get());

      return combineLatest(docRefs).pipe(
        map(packDocs => {
          let packs = packDocs.map(packDoc => {
            return {
              ...packDoc.data(),
              id: packDoc.id
            }
          });

          if(params.visibleInShop){
            packs = packs.filter(pack => pack.visibleInShop);
          }

          return packs;
        }),
        catchError(error => {
          console.log(error);
          this.messageSvc.displayError('Packs could not be loaded.');
  
          return [];
        })
      );
    }

    return this.fireStore.collection<PackMainData>('packs').get().pipe(
      map(packDocs => {
        let packs = packDocs.docs.map(packDoc => {
          return {
            ...packDoc.data(),
            id: packDoc.id
          }
        });

        if(params.visibleInShop){
          packs = packs.filter(pack => pack.visibleInShop);
        }

        return packs;
      }),
      catchError(error => {
        console.log(error);
        this.messageSvc.displayError('Packs could not be loaded.');

        return [];
      })
    );
  }

  getPack = (id: string): Observable<Pack> => {
    return this.fireStore.collection<PackMainData>('packs').doc(id).get().pipe(
      map(packDoc => {
        if(packDoc.data()){
          return {
            ...packDoc.data(),
            id: packDoc.id
          };
        } else {
          return null;
        }
      })
    );
  }

  getPacksSelectOptions = (): Observable<SelectControlOption[]> => {
    return this.getPacks()
      .pipe(
        map(packs => {
          return [
            {
              key: '',
              value: 'Select pack'
            },
            ...packs.map(pack => ({
              key: pack.id,
              value: pack.name
            }))
          ];
        })
      )
  }

  createPack = (data: PackMainData): void => {
    this.fireStore.collection<PackMainData>('packs').add(data).then(packDoc => {
      this.messageSvc.displayInfo('The pack was added successfully!');

      this.router.navigate([`/admin/packs/edit/${packDoc.id}`]);
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while adding the pack.');
    });
  }

  updatePack = (id: string, data: PackMainData): void => {
    this.fireStore.collection<PackMainData>('packs').doc(id).update({
      ...data
    }).then(() => {
      this.messageSvc.displayInfo('The pack was updated successfully!');
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while updating the pack.');
    });
  }

  deletePack = (id: string, redirectPath?: string): void => {
    this.fireStore.collection<PackMainData>('packs').doc(id).get().subscribe(packDoc => {
      const imgUrl = packDoc.data().imgUrl;
      
      this.fireStore.collection<PackMainData>('packs').doc(id).delete()
        .then(() => {
          this.messageSvc.displayInfo('The pack was deleted successfully!');

          this.filesSvc.deleteFile(imgUrl);

          if(redirectPath){
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([redirectPath]));
          }
        })
        .catch(error => {
          console.log(error);

          this.messageSvc.displayError('An error occurred while deleting this pack.');
        });
    });
  }

  openPack = (pack: Pack, ownedCardsIds: string[]): Observable<Gift> => {
    return this.cardsSvc
      .getCards({
        set: pack.setId,
        availableInGame: true
      })
      .pipe(
        map(cards => this.getUniqueCardsFromPack(cards, ownedCardsIds)),
        map(cards => {
          const gift: Gift = {
            title: 'Enjoy your new cards!',
            cards: cards
          };
  
          if(cards.length < PACKS_SETTINGS.CARDS_IN_PACK){
            if(cards.length === 0) {
              gift.title = 'You already have all the cards available in that pack!';
              gift.description = 'To not be left with nothing, take these coins as a refund!';
              gift.coins = pack.price;
            } else {
              gift.description = 'These were the last cards you could get from that pack! We refunded you some coins for the cards you didn\'t get.';
              gift.coins = Math.ceil(pack.price * ((PACKS_SETTINGS.CARDS_IN_PACK - cards.length) / PACKS_SETTINGS.CARDS_IN_PACK));
            }
          }

          return gift;
        })
      );
  }

  private getUniqueCardsFromPack = (cards: Card[], ownedCardsIds: string[]): Card[] => {
    const availableCards = cards.filter(card => !ownedCardsIds.includes(card.id));

    if(availableCards.length <= PACKS_SETTINGS.CARDS_IN_PACK) {
      return availableCards;
    } else {
      const uniqueCards: Card[] = [];
      const uniqueIds: number[] = [];
      
      while(uniqueCards.length < PACKS_SETTINGS.CARDS_IN_PACK){
        const id = Math.floor(Math.random() * availableCards.length);

        if(!uniqueIds.includes(id)){
          uniqueIds.push(id);
          uniqueCards.push(availableCards[id]);
        }
      }

      return uniqueCards;
    }
  }
}
