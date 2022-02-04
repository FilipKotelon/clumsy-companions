import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameLoaderService {
  private loadingQueue = [];
  private loadingQueueRegisteredAmount = 0;
  private loadingQueueRequiredRegistrations: number;

  loadingFinished$ = new Subject<boolean>();
  loadingPercentage$ = new Subject<string>();

  checkLoadingStatus = (): void => {
    console.log(this.loadingQueueRequiredRegistrations, this.loadingQueueRegisteredAmount);
    if(!this.loadingQueue.length && this.loadingQueueRequiredRegistrations === this.loadingQueueRegisteredAmount) {
      this.loadingFinished$.next(true);
    }
  }

  registerLoadingObject = (): string => {
    const uniqueObjectId = this.getUniqueObjectId();

    this.loadingQueue.push(uniqueObjectId);
    this.loadingQueueRegisteredAmount++;
    return uniqueObjectId;
  }

  reportLoadedObject = (id: string): void => {
    const objectId = this.loadingQueue.indexOf(id);

    if(objectId >= 0){
      this.loadingQueue.splice(objectId, 1);
      this.loadingPercentage$.next(this.getLoadingPercentage());
      this.checkLoadingStatus();
    }
  }

  setRequiredRegistrations = (amount: number): void => {
    this.loadingQueueRequiredRegistrations = amount;
    this.checkLoadingStatus();
  }

  reset = (): void => {
    this.loadingQueue = [];
    this.loadingQueueRegisteredAmount = 0;
    this.loadingQueueRequiredRegistrations = undefined;
  }

  getUniqueObjectId = (): string => Math.random().toString(36).substring(2, 11);

  private getLoadingPercentage = (): string => {
    return (((this.loadingQueueRequiredRegistrations - this.loadingQueue.length) / this.loadingQueueRequiredRegistrations) * 100).toFixed(2);
  }
}
