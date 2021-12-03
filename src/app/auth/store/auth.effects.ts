import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { tap, map, catchError, switchMap } from 'rxjs/operators'
import { from, Observable, of } from 'rxjs'

import { AuthService } from '@core/services/auth.service'

import { handleAuthSuccess, handleError, getLocalStorageUser } from './auth.helpers'
import { DbUser } from '../models/db-user.model'
import { UserRole } from '../models/user.model'

import * as AuthActions from '@auth/store/auth.actions'
import * as AppMsgActions from '@app/store/app-msg.actions'

@Injectable()
export class AuthEffects {
  usersCollection: AngularFirestoreCollection;

  constructor(
    private actions$: Actions, 
    private fireAuth: AngularFireAuth, 
    private fireStore: AngularFirestore,
    private router: Router,
    private authService: AuthService
  ){
    this.usersCollection = this.fireStore.collection<DbUser>('users');
  }

  authSignUp = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signUpAction: AuthActions.SignUpStart) => {
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
                  role: UserRole.Client,
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
                      map(dbUser => {
                        const theUser = <DbUser>dbUser.data();

                        return handleAuthSuccess({
                          user: {
                            ...theUser,
                            email: userCred.user.email,
                            userId: userCred.user.uid,
                            token: tokenRes.token,
                            role: UserRole.Client,
                            expirationDate: new Date(tokenRes.expirationTime),
                          },
                          redirectTo: '/profile/dashboard'
                        })
                      })
                    )
                  }),
                  catchError((error) => {
                    return handleError(error);
                  })
                )
              }),
              catchError((error) => {
                return handleError(error);
              })
            )
          }),
          catchError((error) => {
            return handleError(error);
          })
        )
      })
    )
  )

  authLogIn = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((logInAction: AuthActions.LoginStart) => {
        return from(
          this.fireAuth.signInWithEmailAndPassword(
            logInAction.payload.email,
            logInAction.payload.password
          )
        ).pipe(
          switchMap(userCred => {
            return this.usersCollection.get()
            .pipe(
              map(dbUsers => {
                return dbUsers.docs.find(dbUser => {
                  return dbUser.get('id') === userCred.user.uid;
                })
              }),
              switchMap((dbUser) => {
                return from(
                  userCred.user.getIdTokenResult()
                ).pipe(
                  map(tokenRes => {
                    const dbUserRole = dbUser ? dbUser.get('role') as UserRole : UserRole.Client;
                    const theUser = <DbUser>dbUser.data();
                    
                    return handleAuthSuccess({
                      user: {
                        ...theUser,
                        email: userCred.user.email,
                        userId: userCred.user.uid,
                        token: tokenRes.token,
                        role: dbUserRole,
                        expirationDate: new Date(tokenRes.expirationTime)
                      },
                      redirectTo: dbUserRole === UserRole.Admin ? '/admin' : '/profile/dashboard'
                    })
                  }),
                  catchError((error) => {
                    return handleError(error);
                  })
                )
              }),
              catchError((error) => {
                return handleError(error);
              })
            )
          }),
          catchError((error) => {
            return handleError(error);
          })
        )
      })
    )
  )

  authSuccess = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.AUTH_SUCCESS),
      tap((authSuccessAction: AuthActions.AuthSuccess) => {
        const expiresIn = authSuccessAction.payload.user.expirationDate.getTime() - new Date().getTime();
        this.authService.setLogOutTimer(expiresIn);

        if(authSuccessAction.payload.redirectTo){
          this.router.navigate([authSuccessAction.payload.redirectTo])
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
        //TODO: eventually refresh token
        //If the action got a verified user in the payload, don't run the verification twice
        if(autoLoginAction.payload){
          const user = autoLoginAction.payload;

          return of(
            handleAuthSuccess({
              user: {
                ...user,
                token: user.token,
                userId: user.id,
                expirationDate: user.tokenExpirationDate
              },
              redirectTo: null
            })
          )
        }

        const user = getLocalStorageUser();

        //Don't log in if no user
        if(!user){
          return new Observable().pipe(
            map(action => {
              return {type: 'DUMMY'}
            })
          )
        }

        return this.usersCollection.get()
          .pipe(
            map(dbUsers => {
              return dbUsers.docs.find(dbUser => {
                return dbUser.get('id') === user.id;
              })
            }),
            map(
              dbUser => {
                //Protect from cheeky users editing localStorage to give themselves admin rights
                const dbUserRole = dbUser ? dbUser.get('role') as UserRole : UserRole.Client;
                const theUser = <DbUser>dbUser.data();
                    
                return handleAuthSuccess({
                  user: {
                    ...theUser,
                    email: user.email,
                    userId: user.id,
                    token: user.token,
                    role: dbUserRole,
                    expirationDate: user.tokenExpirationDate
                  },
                  redirectTo: null
                })
              }
            )
          )
      })
    )
  )

  authLogOut = createEffect(
    () => this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      map(() => {
        this.authService.clearLogOutTimer();
        localStorage.removeItem('loggedInUser');
        this.router.navigate(['/']);
        //TODO: show message that user has been logged out
        return new AppMsgActions.AppInfo('You\'ve been logged out.');
      })
    )
  )
}