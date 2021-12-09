import { Player } from './../../models/player.model'
import { createSelector } from '@ngrx/store'

import * as fromApp from '@app/store/app.reducer'

export const selectPlayer = (state: fromApp.AppState) => state.player.player;

export const selectCoins = createSelector(
  selectPlayer,
  (player: Player) => player.coins
)

export const selectOwnedPacks = createSelector(
  selectPlayer,
  (player: Player) => player.ownedPacks
)