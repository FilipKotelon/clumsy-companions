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

  constructor(private fireAuth: AngularFireAuth, private store: Store<fromApp.AppState>) {}

  setRefreshTimer = (expiresIn: number) => {
    this.refreshTimer = setTimeout(() => {
      this.fireAuth.currentUser.then(user => {
        console.log('Refresh timer');
        console.log(user);
        user.getIdToken(true);
      })
    }, expiresIn)
  }

  clearRefreshTimer = () => {
    if(this.refreshTimer){
      clearTimeout(this.refreshTimer);
    }
  }
}