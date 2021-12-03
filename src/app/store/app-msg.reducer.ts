import * as AppMsgActions from './app-msg.actions';

export interface State {
  error: string,
  info: string
}

const initState: State = {
  error: '',
  info: ''
}

export function appMsgReducer ( state = initState , action: AppMsgActions.AppMsgActions ) {
  switch(action.type){
    case AppMsgActions.APP_ERROR :
      return {
        ...state,
        error: action.payload
      }
    case AppMsgActions.APP_ERROR_CLEAR :
      return {
        ...state,
        error: ''
      }
    case AppMsgActions.APP_INFO :
      return {
        ...state,
        info: action.payload
      }
    case AppMsgActions.APP_INFO_CLEAR :
      return {
        ...state,
        info: ''
      }
    default :
      return state;
  }
}