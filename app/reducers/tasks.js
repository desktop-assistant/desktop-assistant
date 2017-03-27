// @flow
import {
  FETCH_TASKS, FETCH_TASKS_SUCCESS, FETCH_TASKS_FAILURE,
  CREATE_TASKS, CREATE_TASKS_SUCCESS, RESET_NEW_TASKS
} from '../actions/tasks';

const INITIAL_STATE = {
  tasksList: { tasks: [], error: null, loading: false },
	newTask: { post: null, error: null, loading: false },
	activeTask: { post: null, error: null, loading: false },
	deletedTask: { post: null, error: null, loading: false },
};

export default function(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case FETCH_TASKS:// start fetching tasks and set loading = true
    	return { ...state, tasksList: { tasks:[], error: null, loading: true } };
    case FETCH_TASKS_SUCCESS:// return list of tasks and make loading = false
      return { ...state, tasksList: { tasks: action.payload, error: null, loading: false } };
    case FETCH_TASKS_FAILURE:// return error and make loading = false
      error = action.payload || { message: action.payload.message };//2nd one is network or server down errors
      return { ...state, tasksList: { tasks: [], error: error, loading: false} };
    case RESET_NEW_TASKS:
  	  return { ...state, newTask: { task: null, error: null, loading: false } };
    case CREATE_TASKS:
   	  return { ...state, newTask: { ...state.newTask, loading: true } };
    case FETCH_TASKS_FAILURE: // return error and make loading = false
      error = action.payload || { message: action.payload.message };//2nd one is network or server down errors
      return { ...state, tasksList: { tasks: [], error: error, loading: false } };
    case CREATE_TASKS_SUCCESS:
  	  return { ...state, newTask: { task: action.payload, error: null, loading: false } };
    default:
      return state;
  }
}
