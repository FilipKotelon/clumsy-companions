import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthType, DbUser } from './auth.types';

import * as fromStore from '@core/store/reducer';
import * as AuthActions from '@core/auth/store/auth.actions';
import * as AuthHelpers from '@core/auth/store/auth.helpers';
import * as LoadingActions from '@core/loading/store/loading.actions';
import * as MessageActions from '@core/message/store/message.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private refreshTimer: any;

  constructor(
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private store: Store<fromStore.AppState>
  ) {}

  logIn = (email: string, password: string): void => {
    if(email && password){
      this.store.dispatch(
        new AuthActions.LoginStart({ email, password })
      )
    } else {
      this.store.dispatch(
        new MessageActions.Error('Email, password or both were not provided.')
      )
    }
  }

  signUp = (username: string, email: string, password: string): void => {
    if(username && email && password) {
      this.checkForSameUsername(username).subscribe(canCreate => {
        if(canCreate){
          this.store.dispatch(
            new AuthActions.SignUpStart({ email, password, username })
          )
        } else {
          this.store.dispatch(
            new MessageActions.Error('This username is already in use :c Sorry if u spent an hour making up a cool username.')
          )
        }
      });
    } else {
      this.store.dispatch(
        new MessageActions.Error('Email, password, username or all of the above were not provided.')
      )
    }
  }

  resetPassword = (email: string): void => {
    this.store.dispatch(
      new LoadingActions.AppLoadingAdd('AUTH_PASSWORD_RESET_REQUEST')
    );

    this.fireAuth.sendPasswordResetEmail(email)
      .then(() => {
        this.store.dispatch(
          new LoadingActions.AppLoadingRemove('AUTH_PASSWORD_RESET_REQUEST')
        );

        this.store.dispatch(
          new MessageActions.Info('Password reset link has been sent to the email you provided.')
        );
      })
      .catch(e => {
        AuthHelpers.handleError(e, this.store, 'AUTH_PASSWORD_RESET_REQUEST', true);
      })
  }

  handleValidationError = (email: string, password: string, username: string, authType: AuthType) => {
    if(authType === AuthType.LogIn){
      if(!email || !password){
        this.store.dispatch(
          new MessageActions.Error('Please provide your email and password.')
        )
      } else {
        this.store.dispatch(
          new MessageActions.Error('Please check if you provided the correct email and password.')
        )
      }
    } else if(authType === AuthType.SignUp){
      if(!email || !password || !username){
        this.store.dispatch(
          new MessageActions.Error('Please provide your username, email and password.')
        )
      } else {
        this.store.dispatch(
          new MessageActions.Error('Please check if you provided a correct username, email and password.')
        )
      }
    } else if(authType === AuthType.ResetPassword) {
      if(!email){
        this.store.dispatch(
          new MessageActions.Error('Please provide your email.')
        )
      } else {
        this.store.dispatch(
          new MessageActions.Error('Please check if you provided the correct email.')
        )
      }
    }
  }

  checkForSameUsername = (username: string): Observable<boolean> => {
    return this.fireStore.collection<DbUser>('users', ref => {
      let query: CollectionReference | Query = ref;
      query = query.where('username', '==', username);

      return query;
    }).get().pipe(
      take(1),
      map(users => {
        const theUsers = users.docs;

        if(theUsers.length){
          return false;
        }
        return true;
      })
    )
  }

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