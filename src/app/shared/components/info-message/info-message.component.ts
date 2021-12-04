
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'
import { Component, OnInit, OnDestroy } from '@angular/core'

import * as fromApp from '@app/store/app.reducer'
import * as AppMsgActions from '@app/store/app-msg.actions'
import * as AppMsgSelectors from '@app/store/app-msg.selectors'
import { PopupController } from '../../utility/popup-controller.class'

@Component({
  selector: 'app-info-message',
  templateUrl: './info-message.component.html',
  styleUrls: ['./info-message.component.scss']
})
export class InfoMessageComponent extends PopupController {
  constructor(protected store: Store<fromApp.AppState>) {
    super(store, AppMsgSelectors.selectInfo, AppMsgActions.AppInfoClear);
  }
}