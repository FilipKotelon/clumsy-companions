import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { combineLatest, Observable } from 'rxjs';

import { Card } from '@core/cards/cards.types';
import { CardsService } from '@core/cards/cards.service';
import { FilesService } from '@core/files/files.service';
import { MessageService } from '@core/message/message.service';

import * as fromStore from '@core/store/reducer';

import { Pack, PackMainData, PACKS_SETTINGS } from './packs.types';
import { catchError, map, switchMap } from 'rxjs/operators';

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
    private store: Store<fromStore.AppState>
  ) { }

  getPacks = (ids: string[] = []): Observable<Pack[]> => {
    if(ids.length){
      const docRefs = ids.map(id => this.fireStore.collection<PackMainData>('packs').doc(id).get());

      return combineLatest(docRefs).pipe(
        map(packDocs => {
          return packDocs.map(packDoc => {
            return {
              ...packDoc.data(),
              id: packDoc.id
            }
          })
        }),
        catchError(error => {
          console.log(error);
          this.messageSvc.displayError('Packs could not be loaded.');
  
          return [];
        })
      )
    }

    return this.fireStore.collection<PackMainData>('packs').get().pipe(
      map(packDocs => {
        return packDocs.docs.map(packDoc => {
          return {
            ...packDoc.data(),
            id: packDoc.id
          }
        })
      }),
      catchError(error => {
        console.log(error);
        this.messageSvc.displayError('Packs could not be loaded.');

        return [];
      })
    )
  }

  getPack = (id: string): Observable<Pack> => {
    return this.fireStore.collection<PackMainData>('packs').doc(id).get().pipe(
      map(packDoc => {
        if(packDoc.data()){
          return {
            ...packDoc.data(),
            id: packDoc.id
          }
        } else {
          return null;
        }
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
    })
  }

  updatePack = (id: string, data: PackMainData): void => {
    this.fireStore.collection<PackMainData>('packs').doc(id).update({
      ...data
    }).then(() => {
      this.messageSvc.displayInfo('The pack was updated successfully!');
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while updating the pack.');
    })
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
        })
    })
  }

  openPack = (pack: Pack, ownedCardsIds: string[]): Observable<Card[]> => {
    return this.cardsSvc.getCards({
      set: pack.setId,
      availableInGame: true
    }).pipe(
      map(cards => {
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
      })
    )
  }
}
