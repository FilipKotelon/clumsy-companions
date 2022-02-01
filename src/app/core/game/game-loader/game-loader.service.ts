import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameLoaderService {
  loadingFinished$ = new Subject<boolean>();
  loadingQueue = [];

  clearLoadingObject = (id: string): void => {
    const objectId = this.loadingQueue.indexOf(id);
    if(objectId >= 0){
      this.loadingQueue.splice(objectId, 1);

      if(!this.loadingQueue.length) {
        this.loadingFinished$.next(true);
      }
    }
  }

  registerLoadingObject = (): string => {
    const uniqueObjectId = this.getUniqueObjectId();

    this.loadingQueue.push(uniqueObjectId);
    return uniqueObjectId;
  }

  getUniqueObjectId = (): string => Math.random().toString(36).substring(2, 11);
}
