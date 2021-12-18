import { Store } from '@ngrx/store'
import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection, CollectionReference, Query } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { tap, map, catchError, switchMap, mergeMap, take } from 'rxjs/operators'
import { from, Observable, of } from 'rxjs'

import { AuthService } from '@core/services/auth/auth.service'

import { handleAuthSuccess, handleError, getLocalStorageUser } from './auth.helpers'
import { DbUser } from '../models/db-user.model'
import { UserRole } from '../models/user.model'

import * as fromApp from '@app/store/app.reducer';
import * as AppMsgActions from '@app/store/msg/app-msg.actions'
import * as AppLoadingActions from '@app/store/loading/app-loading.actions'
import * as AuthActions from './auth.actions'
import * as AuthSelectors from './auth.selectors';

@Injectable()
export class AuthEffects {
  usersCollection: AngularFirestoreCollection;

  constructor(
    private actions$: Actions, 
    private fireAuth: AngularFireAuth, 
    private fireStore: AngularFirestore,
    private router: Router,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ){
    this.usersCollection = this.fireStore.collection<DbUser>('users');
  }

  authSignUp = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signUpAction: AuthActions.SignUpStart) => {
        this.store.dispatch(
          new AppLoadingActions.AppLoadingAdd('AUTH_PROCESS')
        );
        
        return from(
          this.fireAuth.createUserWithEmailAndPassword(
            signUpAction.payload.email,
            signUpAction.payload.password
          )
        ).pipe(
          switchMap(userCred => {
            return from(this.usersCollection.add(
                {
                  id: userCred.user.uid,
                  username: signUpAction.payload.username,
                  role: UserRole.Player,
                  currentAvatarId: [],
                  currentDeckId: -1,
                  decks: [],
                  ownedAvatars: [],
                  ownedPacks: [],
                  ownedCards: [],
                  ownedSleeves: [],
                  coins: 0,
                  winCount: 0,
                  lossCount: 0
                }
              )
            ).pipe(
              switchMap((dbUser) => {
                return from(
                  userCred.user.getIdTokenResult()
                ).pipe(
                  switchMap(tokenRes => {
                    return from(
                      dbUser.get()
                    ).pipe(
                      mergeMap(dbUser => {
                        const theUser = <DbUser>dbUser.data();

                        return handleAuthSuccess({
                          user: {
                            ...theUser,
                            email: userCred.user.email,
                            token: tokenRes.token,
                            role: UserRole.Player,
                            expirationDate: new Date(tokenRes.expirationTime),
                          },
                          redirectTo: '/hub'
                        })
                      })
                    )
                  }),
                  catchError((error) => {
                    return handleError(error, this.store);
                  })
                )
              }),
              catchError((error) => {
                return handleError(error, this.store);
              })
            )
          }),
          catchError((error) => {
            return handleError(error, this.store);
          })
        )
      })
    )
  )

  authLogIn = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((logInAction: AuthActions.LoginStart) => {
        this.store.dispatch(
          new AppLoadingActions.AppLoadingAdd('AUTH_PROCESS')
        );

        return from(
          this.fireAuth.signInWithEmailAndPassword(
            logInAction.payload.email,
            logInAction.payload.password
          )
        ).pipe(
          switchMap(userCred => {
            return this.fireStore.collection<DbUser>('users', ref => {
              let query: CollectionReference | Query = ref;
              query = query.where('id', '==', userCred.user.uid);

              return query;
            }).get().pipe(
              switchMap((dbUser) => {
                return from(
                  userCred.user.getIdTokenResult()
                ).pipe(
                  mergeMap(tokenRes => {
                    const theUser = <DbUser>dbUser.docs[0].data();
                    const dbUserRole = dbUser ? theUser.role : UserRole.Player;
                    
                    return handleAuthSuccess({
                      user: {
                        ...theUser,
                        email: userCred.user.email,
                        token: tokenRes.token,
                        role: dbUserRole,
                        expirationDate: new Date(tokenRes.expirationTime),
                      },
                      redirectTo: dbUserRole === UserRole.Admin ? '/admin' : '/hub'
                    })
                  }),
                  catchError((error) => {
                    return handleError(error, this.store);
                  })
                )
              }),
              catchError((error) => {
                return handleError(error, this.store);
              })
            )
          }),
          catchError((error) => {
            return handleError(error, this.store);
          })
        )
      })
    )
  )

  authSuccess = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.AUTH_SUCCESS),
      tap((authSuccessAction: AuthActions.AuthSuccess) => {
        // const expiresIn = authSuccessAction.payload.user.tokenExpirationDate.getTime() - new Date().getTime();
        const expiresIn = 3600 * 1000;

        //Refresh instantly and set a refresh timer for an hour minus 30 seconds, so it refreshes before it expires in firebase
        this.authService.setRefreshTimer(expiresIn - 30000);

        if(authSuccessAction.payload.redirectTo){
          this.router.navigate([authSuccessAction.payload.redirectTo])
        }

        this.store.dispatch(
          new AppLoadingActions.AppLoadingRemove('AUTH_PROCESS')
        );
      })
    ),
    {
      dispatch: false
    }
  )

  authAutoLogin = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      switchMap((autoLoginAction: AuthActions.AutoLogin) => {
        this.store.dispatch(
          new AppLoadingActions.AppLoadingAdd('AUTH_PROCESS')
        );

        //TODO: eventually refresh token
        //If the action got a verified user in the payload, don't run the verification twice
        if(autoLoginAction.payload){
          const user = autoLoginAction.payload;

          //kinda dirty but works, TODO: better solution
          return of('').pipe(
            mergeMap(() => {
              return handleAuthSuccess({
                user: {
                  ...user,
                  token: user.token,
                  expirationDate: user.expirationDate
                },
                redirectTo: null
              })
            })
          )
        }

        const user = getLocalStorageUser();

        //Don't log in if no user
        if(!user){
          this.store.dispatch(
            new AppLoadingActions.AppLoadingRemove('AUTH_PROCESS')
          );

          return new Observable().pipe(
            map(action => {
              return {type: 'DUMMY'}
            })
          )
        }

        return this.fireStore.collection<DbUser>('users', ref => {
            let query: CollectionReference | Query = ref;
            query = query.where('id', '==', user.id);

            return query;
          }).get().pipe(
            mergeMap(dbUser => {
              const theUser = <DbUser>dbUser.docs[0].data();
              //Protect from cheeky users editing localStorage to give themselves admin rights
              const dbUserRole = theUser ? theUser.role as UserRole : UserRole.Player;
                  
              return handleAuthSuccess({
                user: {
                  ...theUser,
                  email: user.email,
                  token: user.token,
                  role: dbUserRole,
                  expirationDate: new Date(user.tokenExpirationDate),
                },
                redirectTo: null
              })
            }),
            catchError((error) => {
              return handleError(error, this.store);
            })
          )
      })
    )
  )

  authLogOut = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      map(() => {
        this.fireAuth.signOut();
        this.authService.clearRefreshTimer();
        localStorage.removeItem('loggedInUser');
        this.router.navigate(['/']);
        return new AppMsgActions.AppInfo('You\'ve been logged out.');
      }),
      catchError((error) => {
        return handleError(error, this.store);
      })
    )
  )

  authRefreshToken = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.REFRESH_TOKEN),
      tap(() => {
        this.store.select(AuthSelectors.selectUser).pipe(
          take(1)
        ).subscribe(user => {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
        })
      }),
      catchError((error) => {
        return handleError(error, this.store);
      })
    ),
    {
      dispatch: false
    }
  )
}