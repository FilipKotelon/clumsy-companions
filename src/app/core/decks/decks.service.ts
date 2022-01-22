import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { NavigationEnd, Router } from '@angular/router';

import { MessageService } from '@core/message/message.service';
import { PlayerService } from '@core/player/player.service';
import { combineLatest, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Deck, DeckMainData, DeckQueryParams } from './decks.types';

@Injectable({
  providedIn: 'root'
})
export class DecksService {
  constructor(
    private fireStore: AngularFirestore,
    private messageSvc: MessageService,
    private playerSvc: PlayerService,
    private router: Router
  ) { }

  getDecks = (params?: DeckQueryParams): Observable<Deck> => {
    if(params && params.ids?.length){
      const docRefs = params.ids.map(id => this.fireStore.collection<DeckMainData>('decks').doc(id).get());

      return combineLatest(docRefs).pipe(
        map(deckDocks => {
          let decks = deckDocks.map(deckDoc => {
            return {
              ...deckDoc.data(),
              id: deckDoc.id
            }
          })

          if(params.global !== undefined){
            decks = decks.filter(deck => deck.global === params.global);
          }
        }),
        catchError(error => {
          console.log(error);
          this.messageSvc.displayError('Decks could not be loaded.');
  
          return [];
        })
      )
    }

    return this.fireStore.collection<DeckMainData>('decks', ref => {
      let query: CollectionReference | Query = ref;

      if(params){
        if(params.global !== undefined){
          query = query.where('global', '==', params.global);
        }
      }

      return query;
    }).get().pipe(
      map(deckDocks => {
        return deckDocks.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          };
        })
      }),
      catchError(error => {
        console.log(error);
        this.messageSvc.displayError('Decks could not be loaded.');

        return [];
      })
    )
  }

  getDeck = (id: string) => {
    return this.fireStore.collection<DeckMainData>('decks').doc(id).get().pipe(
      map(deckDoc => {
        if(deckDoc.data()){
          return {
            ...deckDoc.data(),
            id
          }
        } else {
          return null;
        }
      })
    )
  }

  createDeck = (data: DeckMainData, assignToPlayer = true) => {
    this.fireStore.collection<DeckMainData>('decks').add({
      ...data
    }).then(deckDoc => {
      if(!assignToPlayer) {
        this.messageSvc.displayInfo('Deck created successfully!');
        this.router.navigate([`/admin/cards/edit/${deckDoc.id}`]);
      } else {
        this.playerSvc.assignDeck(deckDoc.id, () => {
          this.messageSvc.displayInfo('Deck saved!');
          this.router.navigate([`/hub/decks/edit/${deckDoc.id}`]);
        })
      }
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while creating the deck.');
    })
  }

  updateDeck = (id: string, data: DeckMainData) => {
    this.fireStore.collection<DeckMainData>('decks').doc(id)
      .update(data)
      .then(() => {
        this.messageSvc.displayInfo('Deck updated successfully!');
      })
      .catch(error => {
        console.log(error);
  
        this.messageSvc.displayError('An error occurred while updating the deck.');
      })
  }

  deleteDeck = (id: string, redirectPath?: string) => {
    this.fireStore.collection<DeckMainData>('decks').doc(id).delete()
      .then(() => {
        this.messageSvc.displayInfo('The deck was deleted successfully!');

        if(redirectPath){
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([redirectPath]));
        }
      })
      .catch(error => {
        console.log(error);

        this.messageSvc.displayError('An error occurred while deleting this deck.');
      })
  }
}
