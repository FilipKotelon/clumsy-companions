import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as GameStateActions from '@core/game/store/game.state.actions';
import * as GameSelectors from '@core/game/store/game.selectors';

@Injectable({
  providedIn: 'root'
})
export class GameLoaderService {
  private loadingQueue = [];
  private loadingQueueRegisteredAmount = 0;
  private loadingQueueRequiredRegistrations: number;

  loadingFinished$: Observable<boolean>;
  loadingPercentage$ = new Subject<string>();

  constructor(private store: Store<fromStore.AppState>) {
    this.loadingFinished$ = this.store.select(GameSelectors.selectIsLoaded);
  }

  checkLoadingStatus = (): void => {
    if(!this.loadingQueue.length && this.loadingQueueRequiredRegistrations === this.loadingQueueRegisteredAmount) {
      this.store.dispatch(GameStateActions.gameLoadEnd());
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
