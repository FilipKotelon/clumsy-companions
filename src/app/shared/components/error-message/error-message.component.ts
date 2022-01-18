import { Store } from '@ngrx/store';
import { Component } from '@angular/core';

import * as fromStore from '@core/store/reducer';
import * as MessageActions from '@core/message/store/message.actions';
import * as MessageSelectors from '@core/message/store/message.selectors';
import { PopupController } from '@shared/utility/popup-controller.class';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html'
})
export class ErrorMessageComponent extends PopupController {
  constructor(protected store: Store<fromStore.AppState>) {
    super(store, MessageSelectors.selectError, new MessageActions.ErrorClear());
  }
}