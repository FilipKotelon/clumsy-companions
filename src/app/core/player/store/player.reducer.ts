import { Player } from '@core/player/player.types';

import * as PlayerActions from './player.actions';

export interface State {
  player: Player;
}

const initState: State = {
  player: null
}

export function playerReducer ( state = initState, action: PlayerActions.PlayerActions ): State {
  switch(action.type){
    case PlayerActions.PLAYER_SET :
      return {
        ...state,
        player: action.payload
      }
    default:
      return {
        ...state
      }
  }
}