import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map, catchError, switchMap, mergeMap, take } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';

import { handleAuthSuccess, handleError, getLocalStorageUser } from './auth.helpers';
import { DbUser, UserRole } from '@core/auth/auth.types';
import { PlayerService } from '@core/player/player.service';

import * as fromStore from '@core/store/reducer';
import * as MessageActions from '@core/message/store/message.actions';
import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';
import { GiftService } from '@core/gift/gift.service';
import { MessageService } from '@core/message/message.service';
import { LoadingService } from '@core/loading/loading.service';

@Injectable()
export class AuthEffects {
  usersCollection: AngularFirestoreCollection;

  constructor(
    private actions$: Actions, 
    private authService: AuthService,
    private fireAuth: AngularFireAuth, 
    private fireStore: AngularFirestore,
    private giftSvc: GiftService,
    private loadingSvc: LoadingService,
    private messageSvc: MessageService,
    private playerSvc: PlayerService,
    private router: Router,
    private store: Store<fromStore.AppState>
  ){
    this.usersCollection = this.fireStore.collection<DbUser>('users');
  }

  // Efekt zadeklarowany w klasie AuthEffects
  authSignUp = createEffect(
    () => this.actions$.pipe(
      // Wybranie typu akcji, która ma być przechwytywana
      ofType(AuthActions.SIGNUP_START),
      switchMap((signUpAction: AuthActions.SignUpStart) => {
        this.loadingSvc.addLoadingTask('AUTH_PROCESS');
        
        return from(
          // Wysłanie zapytania do bazy danych w celu stworzenia nowego użytkownika
          this.fireAuth.createUserWithEmailAndPassword(
            signUpAction.payload.email,
            signUpAction.payload.password
          )
        ).pipe(
          switchMap(userCred => {
            // Dodanie rekordu w bazie z podstawowymi danymi nowego gracza
            return from(this.usersCollection.add(
                {
                  id: userCred.user.uid,
                  username: signUpAction.payload.username,
                  role: UserRole.Player,
                  currentAvatarId: '',
                  currentDeckId: -1,
                  decksIds: [],
                  ownedAvatarsIds: [],
                  ownedPacksIds: [],
                  ownedCardsIds: [],
                  ownedSleevesIds: [],
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
                            dbId: dbUser.id,
                            email: userCred.user.email,
                            token: tokenRes.token,
                            role: UserRole.Player,
                            expirationDate: new Date(tokenRes.expirationTime),
                            receivedWelcomeBundle: false
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
        this.loadingSvc.addLoadingTask('AUTH_PROCESS');

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
                    const dbUserReceivedWelcomeBundle = dbUser ? theUser.receivedWelcomeBundle : false;

                    return handleAuthSuccess({
                      user: {
                        ...theUser,
                        dbId: dbUser.docs[0].id,
                        email: userCred.user.email,
                        token: tokenRes.token,
                        role: dbUserRole,
                        expirationDate: new Date(tokenRes.expirationTime),
                        receivedWelcomeBundle: dbUserReceivedWelcomeBundle
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

        this.loadingSvc.removeLoadingTask('AUTH_PROCESS');

        if(!authSuccessAction.payload.user.receivedWelcomeBundle){
          const oopsMsg = 'Ummm so you were supposed to get a gift but it didn\'t work... If I happen to fix it in the meantime, you will get it the next time you log in!';

          this.loadingSvc.addLoadingTask('PLAYER_RECEIVE_GIFT');

          this.playerSvc.getPlayer().pipe(
            take(1)
          ).subscribe(player => {
            this.giftSvc.prepareWelcomeBundle()
              .subscribe(bundle => {
                const bundleCorrectlyLoaded = Object.values(bundle).every(gift => gift.coins || gift.decks?.length || gift.avatar);
  
                if(bundleCorrectlyLoaded){
                  this.playerSvc.receiveWelcomeBundle(bundle, player)
                    .then(() => {
                      this.loadingSvc.removeLoadingTask('PLAYER_RECEIVE_GIFT');
                      this.messageSvc.displayInfo('Welcome to Clumsy Companions! Once you open your gifts, you can see the tutorial by pressing the question mark in the top right corner!')
                    })
                    .catch(e => {
                      console.log(e);
                      this.messageSvc.displayError(oopsMsg);
                    });
                } else {
                  this.messageSvc.displayError(oopsMsg);
                }
              });
          })
        }
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
        this.loadingSvc.addLoadingTask('AUTH_PROCESS');

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
          this.loadingSvc.removeLoadingTask('AUTH_PROCESS');

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
              const dbUserReceivedWelcomeBundle = theUser ? theUser.receivedWelcomeBundle : false;
                  
              return handleAuthSuccess({
                user: {
                  ...theUser,
                  dbId: dbUser.docs[0].id,
                  email: user.email,
                  token: user.token,
                  role: dbUserRole,
                  expirationDate: new Date(user.tokenExpirationDate),
                  receivedWelcomeBundle: dbUserReceivedWelcomeBundle
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
        return new MessageActions.Info('You\'ve been logged out.');
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