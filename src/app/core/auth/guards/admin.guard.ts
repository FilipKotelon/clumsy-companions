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
// Klasa pełniąca rolę strażnika
export class AdminGuard extends AuthBaseGuard implements CanActivate {
  constructor(store: Store<fromStore.AppState>, router: Router, fireStore: AngularFirestore){
    super(store, router, fireStore);
  }

  // Metoda sprawdzająca, czy można aktywować daną ścieżkę
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): | boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.checkUser().pipe(
      take(1),
      map((user: User) => {
        // Jeśli obecny użytkownik nie jest zalogowany, zostanie przekierowany na stronę autoryzacji
        if(!user){
          return this.router.createUrlTree(['/auth/log-in'])
        }

        // Sprawdzenie, czy użytkownik ma rolę administratora
        const isAdmin = user.role === UserRole.Admin;

        // Jeśli użytkownik jest administratorem, ścieżka zostaje aktywowana
        if(isAdmin){
          return true;
        }

        // W przeciwnym razie zostanie przekierowany do centrum gracza
        return this.router.createUrlTree(['/hub'])
      })
    )
  }
}