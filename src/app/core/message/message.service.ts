import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as MessageActions from '@core/message/store/message.actions';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private store: Store<fromStore.AppState>) { }

  displayInfo = (msg: string): void => {
    this.store.dispatch(
      new MessageActions.Info(msg)
    );
  }

  displayError = (msg: string): void => {
    this.store.dispatch(
      new MessageActions.Error(msg)
    );
  }

}
