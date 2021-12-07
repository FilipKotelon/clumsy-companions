import * as AppLoadingActions from './app-loading.actions';

/**
 * List of all possible tasks that make the app go into the state of global loading
 */
export type AppTask = 
  'AUTH_PROCESS' | 
  'AUTH_PASSWORD_RESET_REQUEST'

export interface State {
  tasks: AppTask[];
}

const initState: State = {
  tasks: []
}

export function appLoadingReducer ( state = initState, action: AppLoadingActions.AppLoadingActions ): State {
  switch(action.type){
    case AppLoadingActions.APP_LOADING_ADD: {
      const tasks = [...state.tasks];
      tasks.push(action.payload);

      return {
        ...state,
        tasks
      }
    }
    case AppLoadingActions.APP_LOADING_REMOVE: {
      let tasks = [...state.tasks];
      tasks.splice(tasks.indexOf(action.payload), 1);

      return {
        ...state,
        tasks
      }
    }
    case AppLoadingActions.APP_LOADING_CLEAR: {
      return {
        ...state,
        tasks: []
      }
    }
    default:
      return state;
  }
}