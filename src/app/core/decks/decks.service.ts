import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, DocumentReference, Query } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { MessageService } from '@core/message/message.service';
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
    private router: Router
  ) { }

  getDecks = (params: DeckQueryParams = {}): Observable<Deck[]> => {
    if(params.ids?.length){
      const docRefs = params.ids.map(id => this.fireStore.collection<DeckMainData>('decks').doc(id).get());

      return combineLatest(docRefs).pipe(
        map(deckDocks => {
          let decks = deckDocks.map(deckDoc => {
            return {
              ...deckDoc.data(),
              id: deckDoc.id
            }
          });

          if(params.global !== undefined){
            decks = decks.filter(deck => deck.global === params.global);
          }

          if(params.names?.length){
            decks = decks.filter(deck => params.names.includes(deck.name));
          }

          return decks;
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
        let decks = deckDocks.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        if(params.names?.length){
          decks = decks.filter(deck => params.names.includes(deck.name));
        }

        return decks;
      }),
      catchError(error => {
        console.log(error);
        this.messageSvc.displayError('Decks could not be loaded.');

        return [];
      })
    )
  }

  getDeck = (id: string): Observable<Deck> => {
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

  createDeck = (data: DeckMainData, assignToPlayer = true, callback?: Function): void => {
    this.addDeckToDatabase(data).then(deckDoc => {
      if(!assignToPlayer) {
        this.messageSvc.displayInfo('Deck created successfully!');
        this.router.navigate([`/admin/decks/edit/${deckDoc.id}`]);
      } else {
        if(callback){
          callback(deckDoc.id);
        }
      }
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while creating the deck.');
    })
  }

  addDeckToDatabase = (data: DeckMainData): Promise<DocumentReference<DeckMainData>> => {
    return this.fireStore.collection<DeckMainData>('decks').add({
      ...data
    });
  }

  updateDeck = (id: string, data: DeckMainData): void => {
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

  deleteDeck = (id: string, redirectPath?: string, callback?: Function): void => {
    this.fireStore.collection<DeckMainData>('decks').doc(id).delete()
      .then(() => {
        this.messageSvc.displayInfo('The deck was deleted successfully!');

        if(redirectPath){
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([redirectPath]));
        }

        if(callback){
          callback(id);
        }
      })
      .catch(error => {
        console.log(error);

        this.messageSvc.displayError('An error occurred while deleting this deck.');
      })
  }
}
