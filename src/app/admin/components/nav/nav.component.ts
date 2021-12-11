import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '@app/store/app.reducer';
import * as AuthActions from '@auth/store/auth.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  logOut = (): void => {
    this.store.dispatch(
      new AuthActions.Logout()
    )
  }
}
