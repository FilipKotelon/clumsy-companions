import { map, catchError } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';

import { Card, CardMainData, DbCard } from '@core/cards/cards.types';
import { FilesService } from '@core/files/files.service';
import { MessageService } from '@core/message/message.service';

import { CardQueryParams } from './cards.types';

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  constructor(
    private filesSvc: FilesService,
    private fireStore: AngularFirestore,
    private messageSvc: MessageService,
    private router: Router
  ) { }

  getCards = (params?: CardQueryParams): Observable<Card[]> => {
    if(params && params.ids?.length) {
      const docRefs = params.ids.map(id => this.fireStore.collection<DbCard>('cards').doc(id).get());

      return combineLatest(docRefs).pipe(
        map(cardDocs => {
          return cardDocs.map(doc => {
            return {
              ...doc.data(),
              id: doc.id
            };
          })
        }),
        map(cards => {
          let finalCards = cards;
          
          if(params){
            if(params.set){
              finalCards = finalCards.filter(card => card.setId === params.set);
            }

            if(params.type){
              finalCards = finalCards.filter(card => card.type === params.type);
            }

            if(params.availableInGame !== undefined){
              finalCards = finalCards.filter(card => card.availableInGame === params.availableInGame);
            }

            if(params.name){
              finalCards = finalCards.filter(card => card.name.includes(params.name));
            }
          }
  
          return finalCards;
        }),
        catchError(error => {
          console.log(error);
          this.messageSvc.displayError('Cards could not be loaded.');
  
          return [];
        })
      );
    }

    return this.fireStore.collection<DbCard>('cards', ref => {
      let query: CollectionReference | Query = ref;

      if(params){
        if(params.set){
          query = query.where('setId', '==', params.set);
        }
  
        if(params.type){
          query = query.where('type', '==', params.type);
        }

        if(params.availableInGame !== undefined){
          query = query.where('availableInGame', '==', params.availableInGame);
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

  updateCard = (id: string, data: CardMainData): void => {
    this.fireStore.collection<DbCard>('cards').doc(id)
      .update(data)
      .then(() => {
        this.messageSvc.displayInfo('Card updated successfully!');
      })
      .catch(error => {
        console.log(error);
  
        this.messageSvc.displayError('An error occurred while updating the card.');
      })
  }

  deleteCard = (id: string, redirectPath?: string): void => {
    this.fireStore.collection<DbCard>('cards').doc(id).get().subscribe(cardDoc => {
      const data = cardDoc.data();

      if(!data){
        this.messageSvc.displayError('The card with this id does not exist.');
      }

      const imgUrl = data.imgUrl;

      this.fireStore.collection<DbCard>('cards').doc(id).delete()
        .then(() => {
          this.messageSvc.displayInfo('The card was deleted successfully!');

          this.filesSvc.deleteFile(imgUrl);

          if(redirectPath){
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([redirectPath]));
          }
        })
        .catch(error => {
          console.log(error);

          this.messageSvc.displayError('An error occurred while deleting this card.');
        })
    })
  }
}
