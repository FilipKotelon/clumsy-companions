import { User } from '@core/auth/auth.types';
import * as AuthActions from './auth.actions';

export interface State {
  user: User
}

const initState: State = {
  user: null
}

export function authReducer ( state = initState, action: AuthActions.AuthActions ): State {
  switch(action.type){

    case AuthActions.AUTH_SUCCESS :
      return {
        ...state,
        user: action.payload.user
      }
      
    case AuthActions.LOGOUT :
      return {
        ...state,
        user: null
      }

    case AuthActions.REFRESH_TOKEN :
      const user = new User(
        state.user.email,
        state.user.id,
        state.user.dbId,
        state.user.role,
        action.payload.token,
        action.payload.expirationTime
      );

      return {
        ...state,
        user
      }

    default:
      return state;
      
  }
}