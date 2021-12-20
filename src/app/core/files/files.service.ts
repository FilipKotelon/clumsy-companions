import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

import * as fromStore from '@core/store/reducer';
import * as MessageActions from '@core/message/store/message.actions';

import { FileUploadResponse } from './files.types';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  constructor(
    private fireStorage: AngularFireStorage,
    private store: Store<fromStore.AppState>
  ) { }

  uploadFile = (file: File, path: string, fileName: string, replacedFilePath?: string): FileUploadResponse => {
    const filePath = `${path}/${this.getUniqueFileName(fileName)}`;
    const fileRef = this.fireStorage.ref(filePath);
    const task = fileRef.put(file);

    const response: FileUploadResponse = {
      percentage$: task.percentageChanges(),
      fileUrl$: task.snapshotChanges().pipe(
        switchMap(() => {
          return fileRef.getDownloadURL().pipe(
            switchMap((url: string) => {
              if(replacedFilePath){
                //After successful upload, delete the previous file
                this.deleteFile(replacedFilePath);
              }
              return of(url);
            })
          )
        }),
        catchError(error => {
          console.log(error);
          this.store.dispatch(new MessageActions.Error('File upload failed.'))
  
          return of('')
        })
      )
    }

    return response;
  }

  deleteFile = (path: string): void => {
    this.fireStorage.refFromURL(path)
      .delete()
      .pipe(
        take(1),
        catchError(error => {
          console.log(error);
          return of(
            this.store.dispatch(
              new MessageActions.Error(`Corresponding image was not deleted from storage.`)
            )
          )
        })
      ).subscribe()
  }

  getUniqueFileName = (fileName: string) => {
    return fileName.split(/(\\|\/)/g).pop() + '_' + this.getRandomFileId();
  }

  getRandomFileId = () => Math.random().toString(36).substr(2, 9);
}
