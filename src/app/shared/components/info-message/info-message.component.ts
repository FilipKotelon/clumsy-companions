import { Store } from '@ngrx/store';
import { Component } from '@angular/core';

import * as fromStore from '@core/store/reducer';
import * as MessageActions from '@core/message/store/message.actions';
import * as MessageSelectors from '@core/message/store/message.selectors';
import { PopupController } from '../../utility/popup-controller.class';

@Component({
  selector: 'app-info-message',
  templateUrl: './info-message.component.html'
})
export class InfoMessageComponent extends PopupController {
  constructor(protected store: Store<fromStore.AppState>) {
    super(store, MessageSelectors.selectInfo, new MessageActions.InfoClear());
  }
}