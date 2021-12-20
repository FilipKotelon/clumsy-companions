import * as MessageActions from './message.actions';

export interface State {
  error: string,
  info: string
}

const initState: State = {
  error: '',
  info: ''
}

export function messageReducer ( state = initState , action: MessageActions.MessageActions ): State {
  switch(action.type){
    case MessageActions.ERROR :
      return {
        ...state,
        error: action.payload
      }
    case MessageActions.ERROR_CLEAR :
      return {
        ...state,
        error: ''
      }
    case MessageActions.INFO :
      return {
        ...state,
        info: action.payload
      }
    case MessageActions.INFO_CLEAR :
      return {
        ...state,
        info: ''
      }
    default :
      return state;
  }
}