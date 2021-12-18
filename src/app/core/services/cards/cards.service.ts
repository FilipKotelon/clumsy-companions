import { Store } from '@ngrx/store';
import { take, map, catchError } from 'rxjs/operators'
import { Observable } from 'rxjs'

import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore'

import { Card } from '@shared/components/card/models/card.model'

import { CardQueryParams } from './cards.types';

import * as fromApp from '@app/store/app.reducer';
import * as AppMsgActions from '@app/store/msg/app-msg.actions';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  constructor(
    private store: Store<fromApp.AppState>,
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
          if(params.search){
            finalCards = cards.filter(card => card.name.includes(params.search));
          }
        }

        return finalCards;
      }),
      catchError(error => {
        console.log(error);
        this.store.dispatch(
          new AppMsgActions.AppError('Cards could not be loaded.')
        )

        return [];
      })
    )
  }
}
