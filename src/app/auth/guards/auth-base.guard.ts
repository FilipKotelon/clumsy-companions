import { DbUser } from './../models/db-user.model'
import { getLocalStorageUser } from './../store/auth.helpers'
import { User, UserRole } from '../models/user.model'
import { Store } from '@ngrx/store'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFirestore, AngularFirestoreCollection, CollectionReference, Query } from '@angular/fire/compat/firestore'
import { of, Observable } from 'rxjs'
import { catchError, map, take, switchMap, tap } from 'rxjs/operators'

import * as fromApp from '@app/store/app.reducer'
import * as AuthSelectors from '@auth/store/auth.selectors'
import * as AuthActions from '@auth/store/auth.actions'

@Injectable({
  providedIn: 'root'
})
export abstract class AuthBaseGuard {  
  constructor(protected store: Store<fromApp.AppState>, protected router: Router, protected fireStore: AngularFirestore){ }

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
              return this.fireStore.collection<DbUser>('users', ref => {
                let query: CollectionReference | Query = ref;
                query = query.where('id', '==', finalUser.user.id);

                return query;
              }).get().pipe(
                map(dbUser => {
                  if(dbUser.docs.length){
                    const theUser = <DbUser>dbUser.docs[0].data();
                    const dbUserRole = dbUser ? theUser.role : UserRole.Player;
        
                    if(dbUserRole === finalUser.user.role){
                      //Check if user was not logged in already by the app component
                      this.store.select(AuthSelectors.selectUser).pipe(
                        take(1),
                        map(user => user)
                      ).subscribe( user => {
                        if(!user){
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
                      });
        
                      return finalUser.user;
                    } else {
                      return null
                    }
                  } else {
                    return null;
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