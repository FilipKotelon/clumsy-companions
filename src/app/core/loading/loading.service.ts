import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '@core/store/reducer';

import * as LoadingActions from '@core/loading/store/loading.actions';
import { LoadingTask } from './loading.types';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor(private store: Store<AppState>) { }

  addLoadingTask = (task: LoadingTask) => {
    this.store.dispatch(
      new LoadingActions.AppLoadingAdd(task)
    );
  }

  removeLoadingTask = (task: LoadingTask) => {
    this.store.dispatch(
      new LoadingActions.AppLoadingRemove(task)
    );
  }

  clearLoadingTasks = () => {
    this.store.dispatch(
      new LoadingActions.AppLoadingClear()
    );
  }
}
