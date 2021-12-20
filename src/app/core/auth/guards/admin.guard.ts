import { User, UserRole } from '@core/auth/auth.types';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import * as fromStore from '@core/store/reducer';
import { map, take } from 'rxjs/operators';
import { AuthBaseGuard } from './auth-base.guard';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard extends AuthBaseGuard implements CanActivate {
  constructor(store: Store<fromStore.AppState>, router: Router, fireStore: AngularFirestore){
    super(store, router, fireStore);
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): | boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.checkUser().pipe(
      take(1),
      map((user: User) => {
        if(!user){
          return this.router.createUrlTree(['/auth/log-in'])
        }

        const isAdmin = user.role === UserRole.Admin;

        if(isAdmin){
          return true;
        }
        
        return this.router.createUrlTree(['/auth/log-in'])
      })
    )
  }
}