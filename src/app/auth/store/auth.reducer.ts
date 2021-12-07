import { User } from './../models/user.model'
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

    default:
      return state;
      
  }
}