import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Store } from '@ngrx/store'
import { Injectable } from "@angular/core";

import * as fromApp from '@app/store/app.reducer'
import * as AuthActions from '@auth/store/auth.actions'

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private refreshTimer: any;

  constructor(
    private fireAuth: AngularFireAuth,
    private store: Store<fromApp.AppState>
  ) {}

  setRefreshTimer = (expiresIn: number): void => {
    this.refreshTimer = setTimeout(() => {
      this.fireAuth.currentUser.then(user => {
        user.getIdTokenResult(true).then(tokenRes => {
          this.store.dispatch(
            new AuthActions.RefreshToken({
              token: tokenRes.token,
              expirationTime: new Date(tokenRes.expirationTime)
            })
          )
        })
      })
    }, expiresIn)
  }

  clearRefreshTimer = (): void => {
    if(this.refreshTimer){
      clearTimeout(this.refreshTimer);
    }
  }
}