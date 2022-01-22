import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DbSet, Set, SetMainData } from './sets.types';
import { FilesService } from '@core/files/files.service';
import { MessageService } from '@core/message/message.service';

import * as fromStore from '@core/store/reducer';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';

@Injectable({
  providedIn: 'root'
})
export class SetsService {

  constructor(
    private fireStore: AngularFirestore,
    private filesSvc: FilesService,
    private messageSvc: MessageService,
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
        this.messageSvc.displayError('Sets could not be loaded.');

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

  getSetSelectOptions = (): Observable<SelectControlOption[]> => {
    return this.getSets().pipe(
      switchMap(sets => {
        return of(
          [
            {
              key: '',
              value: 'Select set'
            },
            ...sets.map(set => ({
              key: set.id,
              value: set.name
            }))
          ]
        )
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
      this.messageSvc.displayInfo('The set was added successfully!');

      this.router.navigate([`/admin/sets/edit/${setDoc.id}`]);
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while adding the set.');
    })
  }

  updateSet = (id: string, data: SetMainData): void => {
    this.fireStore.collection<DbSet>('sets').doc(id).update({
      ...data
    }).then(() => {
      this.messageSvc.displayInfo('The set was updated successfully!');
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while updating the set.');
    })
  }

  deleteSet = (id: string, redirectPath?: string): void => {
    this.fireStore.collection<DbSet>('sets').doc(id).get().subscribe(setDoc => {
      const imgUrl = setDoc.data().imgUrl;
      
      this.fireStore.collection<DbSet>('sets').doc(id).delete()
        .then(() => {
          this.messageSvc.displayInfo('The set was deleted successfully!');

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
