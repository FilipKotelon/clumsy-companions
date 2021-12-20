import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import * as fromStore from '@core/store/reducer';
import * as AuthActions from '@core/auth/store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private refreshTimer: any;

  constructor(
    private fireAuth: AngularFireAuth,
    private store: Store<fromStore.AppState>
  ) {}

  setRefreshTimer = (expiresIn: number): void => {
    this.refreshToken();
    
    this.refreshTimer = setInterval(() => {
      this.refreshToken();
    }, expiresIn)
  }

  refreshToken = (): void => {
    this.fireAuth.currentUser
      .then(user => {
        user.getIdTokenResult(true)
          .then(tokenRes => {
            console.log('refresh');
            
            this.store.dispatch(
              new AuthActions.RefreshToken({
                token: tokenRes.token,
                expirationTime: new Date(tokenRes.expirationTime)
              })
            )
          })
          .catch(e => {
            console.log(e);
            this.clearRefreshTimer();
          })
      })
      .catch(e => {
        console.log(e);
        this.clearRefreshTimer();
      })
  }

  clearRefreshTimer = (): void => {
    if(this.refreshTimer){
      clearInterval(this.refreshTimer);
    }
  }
}