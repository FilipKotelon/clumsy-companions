import { DbUser } from './../models/db-user.model'
import { getLocalStorageUser } from './../store/auth.helpers'
import { User, UserRole } from '../models/user.model'
import { Store } from '@ngrx/store'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { of, Observable } from 'rxjs'
import { catchError, map, take, switchMap, tap } from 'rxjs/operators'

import * as fromApp from '@app/store/app.reducer'
import * as AuthSelectors from '@auth/store/auth.selectors'
import * as AuthActions from '@auth/store/auth.actions'

@Injectable({
  providedIn: 'root'
})
export abstract class AuthBaseGuard {
  usersCollection: AngularFirestoreCollection;
  
  constructor(protected store: Store<fromApp.AppState>, protected router: Router, protected fireStore: AngularFirestore){
    this.usersCollection = this.fireStore.collection<DbUser>('users');
  }

  protected checkUser = (): Observable<User> => {
    return this.store.select(AuthSelectors.selectUser).pipe(
      take(1),
      map(
        (user: User) => {
          const finalUser: { user: User, fromStorage: boolean } = { user: null, fromStorage: false }

          if(user){
            finalUser.user = user;
            return finalUser;
          }

          const storageUser = getLocalStorageUser();
          finalUser.user = storageUser;
          finalUser.fromStorage = true;

          return finalUser;
        }
      ),
      switchMap(
        finalUser => {
          if(finalUser.user){
            if(!finalUser.fromStorage){
              return of(finalUser.user);
            } else {
              return this.usersCollection.get().pipe(
                map(dbUsers => {
                  return dbUsers.docs.find(dbUser => {
                    return dbUser.get('id') === finalUser.user.id;
                  })
                }),
                map(dbUser => {
                  const dbUserRole = dbUser ? dbUser.get('role') as UserRole : UserRole.Player;
      
                  if(dbUserRole === finalUser.user.role){
                    //Check if user was not logged in already by the app component
                    this.store.select(AuthSelectors.selectUser).pipe(
                      take(1),
                      map(user => user)
                    ).subscribe( user => {
                      if(!user){
                        const theUser = <DbUser>dbUser.data();
                        // Log the user in in the background
                        this.store.dispatch(
                          new AuthActions.AutoLogin({
                            ...finalUser.user,
                            ...theUser,
                            token: finalUser.user.token,
                            expirationDate: finalUser.user.tokenExpirationDate
                          })
                        )
                      }
                    }).unsubscribe();
      
                    return finalUser.user;
                  } else {
                    return null
                  }
                }),
                catchError(error => {
                  console.log(error);
                  return null;
                })
              )
            }
          } else {
            return of(null);
          }
        }
      )
    )
  }
}