import { LoadingTask } from '@core/loading/loading.types';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fader } from '@shared/animations/route-animations';

import * as fromStore from '@core/store/reducer';
import * as AppLoadingSelectors from '@core/loading/store/loading.selectors';
import * as AuthSelectors from '@core/auth/store/auth.selectors';
import * as AuthActions from '@core/auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fader
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  storeLoadingSub: Subscription;
  storeAuthSub: Subscription;
  tasks: LoadingTask[];
  isLoading = false;

  constructor(private store: Store<fromStore.AppState>){}

  ngOnInit(): void {
    this.storeLoadingSub = this.store.select(AppLoadingSelectors.selectLoadingTasks).subscribe(tasks => {
      this.tasks = tasks;
      this.isLoading = tasks.length > 0;
    })
    
    this.storeAuthSub = this.store.select(AuthSelectors.selectAuth).pipe(
      take(1),
      map(authState => authState)
    ).subscribe((authState) => {
      if(!authState.user && this.tasks.indexOf('AUTH_PROCESS') < 0){
        this.store.dispatch(
          new AuthActions.AutoLogin()
        )
      }
    })
  }

  ngOnDestroy(): void {
    this.storeLoadingSub.unsubscribe();
    this.storeAuthSub.unsubscribe();
  }

  prepareRoute = (outlet: RouterOutlet) => {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
