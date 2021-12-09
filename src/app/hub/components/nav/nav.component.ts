import { Subscription } from 'rxjs'
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '@app/store/app.reducer';
import * as PlayerSelectors from '@hub/store/player/player.selectors';
import * as AuthActions from '@auth/store/auth.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  coinsSub: Subscription;
  packsSub: Subscription;
  coins: number;
  packsAmount: number;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.coinsSub = this.store.select(PlayerSelectors.selectCoins).subscribe(coins => {
      this.coins = coins;
    })

    this.packsSub = this.store.select(PlayerSelectors.selectOwnedPacks).subscribe(packs => {
      this.packsAmount = packs.length;
    })
  }

  ngOnDestroy(): void {
    this.coinsSub.unsubscribe();
    this.packsSub.unsubscribe();
  }

  logOut = (): void => {
    this.store.dispatch(
      new AuthActions.Logout()
    )
  }
}
