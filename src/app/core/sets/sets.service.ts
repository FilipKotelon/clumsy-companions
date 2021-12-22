import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Set } from './sets.types';

import * as fromStore from '@core/store/reducer';
import * as MessageActions from '@core/message/store/message.actions';

@Injectable({
  providedIn: 'root'
})
export class SetsService {

  constructor(
    private store: Store<fromStore.AppState>,
    private fireStore: AngularFirestore,
    private router: Router
  ) { }

  getSets = (): Observable<Set[]> => {
    return this.fireStore.collection<Set>('sets').get().pipe(
      map(setDocs => {
        return setDocs.docs.map(setDoc => {
          return {
            ...setDoc.data(),
            id: setDoc.id
          }
        })
      }),
      catchError(error => {
        console.log(error);
        this.store.dispatch(
          new MessageActions.Error('Sets could not be loaded.')
        );

        return [];
      })
    )
  }

  getSet = (id: string): Observable<Set> => {
    return this.fireStore.collection<Set>('sets').doc(id).get().pipe(
      map(setDoc => {
        return {
          ...setDoc.data(),
          id: setDoc.id
        }
      })
    )
  }

  redirectOnUneditableSet = (): void => {
    this.store.dispatch(
      new MessageActions.Error('The set with this id is not editable.')
    );

    this.router.navigate(['/admin/sets']);
  }

  handleValidationError = () => {
    this.store.dispatch(
      new MessageActions.Error('Upload an image and provide the set\'s name.')
    )
  }
}
