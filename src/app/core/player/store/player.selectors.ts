import { Player } from '@core/player/player.types';
import { createSelector } from '@ngrx/store';

import * as fromStore from '@core/store/reducer';

export const selectPlayer = (state: fromStore.AppState) => state.player.player;

export const selectCoins = createSelector(
  selectPlayer,
  (player: Player) => player.coins
)

export const selectOwnedPacks = createSelector(
  selectPlayer,
  (player: Player) => player.ownedPacks
)