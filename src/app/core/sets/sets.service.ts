import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DbSet, Set, SetMainData } from './sets.types';
import { FilesService } from '@core/files/files.service';

import * as fromStore from '@core/store/reducer';

import * as MessageActions from '@core/message/store/message.actions';

@Injectable({
  providedIn: 'root'
})
export class SetsService {

  constructor(
    private fireStore: AngularFirestore,
    private filesSvc: FilesService,
    private router: Router,
    private store: Store<fromStore.AppState>
  ) { }

  getSets = (): Observable<Set[]> => {
    return this.fireStore.collection<DbSet>('sets').get().pipe(
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
    return this.fireStore.collection<DbSet>('sets').doc(id).get().pipe(
      map(setDoc => {
        if(setDoc.data()){
          return {
            ...setDoc.data(),
            id: setDoc.id
          }
        } else {
          return null;
        }
      })
    )
  }

  createSet = (data: SetMainData): void => {
    this.fireStore.collection<DbSet>('sets').add({
      name: data.name,
      imgUrl: data.imgUrl,
      dateAdded: new Date(),
      editable: true
    }).then(setDoc => {
      this.store.dispatch(
        new MessageActions.Info('The set was added successfully!')
      );

      this.router.navigate([`/admin/sets/edit/${setDoc.id}`]);
    }).catch(error => {
      console.log(error);

      this.store.dispatch(
        new MessageActions.Error('An error occurred while adding the set.')
      );
    })
  }

  updateSet = (id: string, data: SetMainData): void => {
    this.fireStore.collection<DbSet>('sets').doc(id).update({
      ...data
    }).then(() => {
      this.store.dispatch(
        new MessageActions.Info('The set was updated successfully!')
      );
    }).catch(error => {
      console.log(error);

      this.store.dispatch(
        new MessageActions.Error('An error occurred while updating the set.')
      );
    })
  }

  deleteSet = (id: string, redirectPath?: string): void => {
    this.fireStore.collection<DbSet>('sets').doc(id).get().subscribe(setDoc => {
      const imgUrl = setDoc.data().imgUrl;
      
      this.fireStore.collection<DbSet>('sets').doc(id).delete()
        .then(() => {
          this.store.dispatch(
            new MessageActions.Info('The set was deleted successfully!')
          );

          this.filesSvc.deleteFile(imgUrl);

          if(redirectPath){
            this.router.navigate(['/admin/sets']);
          }
        })
    })
  }

  handleValidationError = () => {
    this.store.dispatch(
      new MessageActions.Error('Upload an image and provide the set\'s name.')
    )
  }
}
