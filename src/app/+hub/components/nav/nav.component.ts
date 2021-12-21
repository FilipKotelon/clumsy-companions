import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as PlayerSelectors from '@core/player/store/player.selectors';
import * as AuthActions from '@core/auth/store/auth.actions';

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
    private store: Store<fromStore.AppState>
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
