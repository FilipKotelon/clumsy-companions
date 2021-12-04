import { Store } from '@ngrx/store'
import { Component } from '@angular/core'

import * as fromApp from '@app/store/app.reducer'
import * as AppMsgActions from '@app/store/app-msg.actions'
import * as AppMsgSelectors from '@app/store/app-msg.selectors'
import { PopupController } from '../../utility/popup-controller.class'

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent extends PopupController {
  constructor(protected store: Store<fromApp.AppState>) {
    super(store, AppMsgSelectors.selectError, AppMsgActions.AppErrorClear);
  }
}