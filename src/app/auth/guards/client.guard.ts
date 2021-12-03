import { User, UserRole } from './../models/user.model'
import { Store } from '@ngrx/store'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs'

import * as fromApp from '@app/store/app.reducer'
import { map, take } from 'rxjs/operators'
import { AuthBaseGuard } from './auth-base.guard'

@Injectable({
  providedIn: 'root'
})
export class ClientGuard extends AuthBaseGuard implements CanActivate {
  constructor(store: Store<fromApp.AppState>, router: Router, fireStore: AngularFirestore){
    super(store, router, fireStore);
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): | boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.checkUser().pipe(
      take(1),
      map((user: User) => {
        const userLoggedIn = !!user;

        if(userLoggedIn){
          return true;
        }
        
        return this.router.createUrlTree(['/profile/log-in'])
      })
    )
  }
}