import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FilesService } from '@core/files/files.service';
import { MessageService } from '@core/message/message.service';
import { combineLatest, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Sleeve, SleeveMainData } from './sleeves.types';

@Injectable({
  providedIn: 'root'
})
export class SleevesService {
  constructor(
    private fireStore: AngularFirestore,
    private filesSvc: FilesService,
    private messageSvc: MessageService,
    private router: Router
  ) { }

  getSleeves = (ids: string[] = []): Observable<Sleeve[]> => {
    if(ids.length){
      const docRefs = ids.map(id => this.fireStore.collection<SleeveMainData>('sleeves').doc(id).get());

      return combineLatest(docRefs).pipe(
        map(sleeveDocs => {
          return sleeveDocs.map(sleeveDoc => {
            return {
              ...sleeveDoc.data(),
              id: sleeveDoc.id
            }
          })
        }),
        catchError(error => {
          console.log(error);
          this.messageSvc.displayError('Sleeves could not be loaded.');
  
          return [];
        })
      );
    }

    return this.fireStore.collection<SleeveMainData>('sleeves').get().pipe(
      map(sleeveDocs => {
        return sleeveDocs.docs.map(sleeveDoc => {
          return {
            ...sleeveDoc.data(),
            id: sleeveDoc.id
          }
        })
      }),
      catchError(error => {
        console.log(error);
        this.messageSvc.displayError('Sleeves could not be loaded.');

        return [];
      })
    );
  }

  getSleeve = (id: string): Observable<Sleeve> => {
    return this.fireStore.collection<SleeveMainData>('sleeves').doc(id).get().pipe(
      map(sleeveDoc => {
        if(sleeveDoc.data()){
          return {
            ...sleeveDoc.data(),
            id: sleeveDoc.id
          }
        } else {
          return null;
        }
      })
    );
  }

  createSleeve = (data: SleeveMainData): void => {
    this.fireStore.collection<SleeveMainData>('sleeves').add(data).then(sleeveDoc => {
      this.messageSvc.displayInfo('The sleeve was added successfully!');

      this.router.navigate([`/admin/sleeves/edit/${sleeveDoc.id}`]);
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while adding the sleeve.');
    });
  }

  updateSleeve = (id: string, data: SleeveMainData): void => {
    this.fireStore.collection<SleeveMainData>('sleeves').doc(id).update({
      ...data
    }).then(() => {
      this.messageSvc.displayInfo('The sleeve was updated successfully!');
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while updating the sleeve.');
    });
  }

  deleteSleeve = (id: string, redirectPath?: string): void => {
    this.fireStore.collection<SleeveMainData>('sleeves').doc(id).get().subscribe(sleeveDoc => {
      const imgUrl = sleeveDoc.data().imgUrl;
      
      this.fireStore.collection<SleeveMainData>('sleeves').doc(id).delete()
        .then(() => {
          this.messageSvc.displayInfo('The sleeve was deleted successfully!');

          this.filesSvc.deleteFile(imgUrl);

          if(redirectPath){
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([redirectPath]));
          }
        })
        .catch(error => {
          console.log(error);

          this.messageSvc.displayError('An error occurred while deleting this sleeve.');
        });
    });
  }
}
