import { Player } from '@core/player/player.types';
import { createSelector } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';

export const selectPlayer = (state: fromStore.AppState) => state.player.player;

export const selectCoins = createSelector(
  selectPlayer,
  (player: Player) => player ? player.coins : null
)

export const selectOwnedPacksIds = createSelector(
  selectPlayer,
  (player: Player) => player ? player.ownedPacksIds : []
)