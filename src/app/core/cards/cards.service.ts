import { Store } from '@ngrx/store';
import { take, map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';

import { Card } from '@core/cards/cards.types';

import { CardQueryParams } from './cards.types';

import * as fromStore from '@core/store/reducer';
import * as MessageActions from '@core/message/store/message.actions';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  constructor(
    private store: Store<fromStore.AppState>,
    private fireStore: AngularFirestore
  ) { }

  getCards = (params?: CardQueryParams): Observable<Card[]> => {
    return this.fireStore.collection<Card>('cards', ref => {
      let query: CollectionReference | Query = ref;

      if(params){
        if(params.set){
          query = query.where('set', '==', params.set);
        }
  
        if(params.type){
          query = query.where('type', '==', params.type);
        }
      }

      return query;
    }).get().pipe(
      map(cardDocs => {
        return cardDocs.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          };
        })
      }),
      map(cards => {
        let finalCards = cards;
        
        if(params){
          if(params.name){
            finalCards = cards.filter(card => card.name.includes(params.name));
          }
        }

        return finalCards;
      }),
      catchError(error => {
        console.log(error);
        this.store.dispatch(
          new MessageActions.Error('Cards could not be loaded.')
        )

        return [];
      })
    )
  }

  getCard = (id: string): Observable<Card> => {
    return this.fireStore.collection<Card>('cards').doc(id).get().pipe(
      map(cardDoc => {
        return cardDoc.data();
      })
    )
  }

  deleteCard = (id: string, redirectPath?: string): void => {
    console.log('todo', id, redirectPath);
  }
}
