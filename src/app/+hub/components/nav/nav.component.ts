import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { PlayerService } from '@core/player/player.service';

import * as fromStore from '@core/store/reducer';
import * as AuthActions from '@core/auth/store/auth.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  coinsSub: Subscription;
  packsSub: Subscription;
  coins = 0;
  packsAmount = 0;

  constructor(
    private playerSvc: PlayerService,
    private store: Store<fromStore.AppState>
  ) { }

  ngOnInit(): void {
    this.coinsSub = this.playerSvc.getCoins().subscribe(coins => {
      this.coins = coins;
    })

    this.packsSub = this.playerSvc.getOwnedPacksIds().subscribe(packs => {
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
