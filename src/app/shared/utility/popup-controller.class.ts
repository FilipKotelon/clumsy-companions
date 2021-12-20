import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Directive, OnInit, OnDestroy } from '@angular/core';

import * as fromStore from '@core/store/reducer';
import * as fromMessageSelectors from '@core/message/store/message.selectors';
import * as MessageActions from '@core/message/store/message.actions';

@Directive()
export abstract class PopupController implements OnInit, OnDestroy {
  private storeSub: Subscription;
  msg = '';
  isOpen = false;
  
  constructor(protected store: Store<fromStore.AppState>, protected msgSelector: fromMessageSelectors.SelectorType, protected clearMsgAction: MessageActions.MessageClearActions) {}

  ngOnInit(): void {
    this.storeSub = this.store.select(this.msgSelector).subscribe(msg => {
      if(msg){
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }

      this.msg = msg;
    })
  }

  ngOnDestroy(): void {
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

  closePopup = (): void => {
    this.store.dispatch(this.clearMsgAction);
  }
}