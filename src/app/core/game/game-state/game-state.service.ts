import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';
import * as GameSelectors from '@core/game/store/game.selectors';

import { PlayerOpponentBundle } from '../game.types';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  constructor(
    private store: Store<fromStore.AppState>
  ) { }

  getPlayers = (): Observable<PlayerOpponentBundle> => {
    return this.store.select(GameSelectors.selectPlayers);
  }
}
