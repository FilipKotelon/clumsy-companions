import { LoadingTask } from '@core/loading/loading.types';
import * as LoadingActions from './loading.actions';

export interface State {
  tasks: LoadingTask[];
}

const initState: State = {
  tasks: []
}

export function appLoadingReducer ( state = initState, action: LoadingActions.LoadingActions ): State {
  switch(action.type){
    case LoadingActions.LOADING_ADD: {
      const tasks = [...state.tasks];
      tasks.push(action.payload);

      return {
        ...state,
        tasks
      }
    }
    case LoadingActions.LOADING_REMOVE: {
      let tasks = [...state.tasks];
      tasks.splice(tasks.indexOf(action.payload), 1);

      return {
        ...state,
        tasks
      }
    }
    case LoadingActions.LOADING_CLEAR: {
      return {
        ...state,
        tasks: []
      }
    }
    default:
      return state;
  }
}