import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User, UserRole } from '@core/auth/auth.types';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import * as fromStore from '@core/store/reducer';
import { map, take } from 'rxjs/operators';
import { AuthBaseGuard } from './auth-base.guard';

@Injectable({
  providedIn: 'root'
})
export class NotLoggedInGuard extends AuthBaseGuard implements CanActivate {
  constructor(store: Store<fromStore.AppState>, router: Router, fireStore: AngularFirestore){
    super(store, router, fireStore);
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): | boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
      return this.checkUser().pipe(
        take(1),
        map((user: User) => {
          const userLoggedIn = !!user;

          if(!userLoggedIn){
            return true;
          }
          
          if(user){
            if(user.role === UserRole.Admin){
              return this.router.createUrlTree(['/admin'])
            } else {
              return this.router.createUrlTree(['/hub'])
            }
          }

          return this.router.createUrlTree(['/'])
        })
      )
  }
}