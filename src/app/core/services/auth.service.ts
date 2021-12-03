import { Store } from '@ngrx/store'
import { Injectable } from "@angular/core";

import * as fromApp from '@app/store/app.reducer'
import * as AuthActions from '@auth/store/auth.actions'

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private logOutTimer: any;

  constructor(private store: Store<fromApp.AppState>) {}

  setLogOutTimer = (expiresIn: number) => {
    this.logOutTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expiresIn)
  }

  clearLogOutTimer = () => {
    if(this.logOutTimer){
      clearTimeout(this.logOutTimer);
    }
  }
}