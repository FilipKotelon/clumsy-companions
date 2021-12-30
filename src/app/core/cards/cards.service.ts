import { Store } from '@ngrx/store';
import { take, map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';

import { Card, CardMainData, DbCard } from '@core/cards/cards.types';
import { MessageService } from '@core/message/message.service';

import { CardQueryParams } from './cards.types';

import * as fromStore from '@core/store/reducer';
import * as MessageActions from '@core/message/store/message.actions';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  constructor(
    private fireStore: AngularFirestore,
    private messageSvc: MessageService,
    private router: Router,
    private store: Store<fromStore.AppState>
  ) { }

  getCards = (params?: CardQueryParams): Observable<Card[]> => {
    return this.fireStore.collection<DbCard>('cards', ref => {
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
        this.messageSvc.displayError('Cards could not be loaded.');

        return [];
      })
    )
  }

  getCard = (id: string): Observable<Card> => {
    return this.fireStore.collection<DbCard>('cards').doc(id).get().pipe(
      map(cardDoc => {
        if(cardDoc.data()){
          return {
            ...cardDoc.data(),
            id
          }
        } else {
          return null;
        }
      })
    )
  }

  createCard = (data: CardMainData): void => {
    this.fireStore.collection<DbCard>('cards').add({
      ...data,
      dateAdded: new Date()
    }).then(cardDoc => {
      this.messageSvc.displayInfo('Card created successfully!');

      this.router.navigate([`/admin/cards/edit/${cardDoc.id}`]);
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while adding the card.');
    })
  }

  updateCard = (data: CardMainData): void => {

  }

  deleteCard = (id: string, redirectPath?: string): void => {
    console.log('todo', id, redirectPath);
  }
}
