import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as AuthActions from '@core/auth/store/auth.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  constructor(
    private store: Store<fromStore.AppState>
  ) { }

  logOut = (): void => {
    this.store.dispatch(
      new AuthActions.Logout()
    )
  }
}
