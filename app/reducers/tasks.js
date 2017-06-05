import {
  FETCH_TASKS, FETCH_TASKS_SUCCESS, FETCH_TASKS_FAILURE,
  GET_CURRENT_TASK, GET_CURRENT_TASK_SUCCESS,
  GET_TASK, GET_TASK_SUCCESS, GET_TASK_FAILURE,
  CREATE_TASKS, CREATE_TASKS_SUCCESS, RESET_NEW_TASKS,
  UPDATE_TASK, UPDATE_TASK_SUCCESS, UPDATE_TASK_FAILURE, RESET_UPDATED_TASK,
  DELETE_TASK, DELETE_TASK_SUCCESS, DELETE_TASK_FAILURE, RESET_DELETED_TASK
} from '../actions/tasks';

const INITIAL_STATE = {
  tasksList: { tasks: [], error: null, loading: false },
  newTask: { task: null, error: null, loading: false },
  deletedTask: { task: null, error: null, loading: false },
  currentTask: { task: null, error: null, loading: false }
};

export default function (state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {
    case FETCH_TASKS:// start fetching tasks and set loading = true
      return { ...state, tasksList: { tasks: [], error: null, loading: true } };
    case FETCH_TASKS_SUCCESS:// return list of tasks and make loading = false
      return { ...state, tasksList: { tasks: action.payload, error: null, loading: false } };
    case FETCH_TASKS_FAILURE:// return error and make loading = false
      // 2nd one is network or server down errors
      error = action.payload || { message: action.payload.message };
      return { ...state, tasksList: { tasks: [], error, loading: false } };
    case GET_CURRENT_TASK:
      return { ...state, currentTask: { ...state.currentTask, loading: true } };
    case GET_CURRENT_TASK_SUCCESS:
      return { ...state, currentTask: { task: action.payload, error: null, loading: false } };
    case GET_TASK:
      return { ...state, task: { tasks: {}, error: null, loading: true } };
    case GET_TASK_SUCCESS:
      return { ...state, task: { task: action.payload, error: null, loading: false } };
    case GET_TASK_FAILURE:
      error = action.payload || { message: action.payload.message };
      return { ...state, task: { task: {}, error, loading: false } };
    case RESET_NEW_TASKS:
      return { ...state, newTask: { task: null, error: null, loading: false } };
    case CREATE_TASKS:
      return { ...state, newTask: { ...state.newTask, loading: true } };
    case CREATE_TASKS_SUCCESS:
      return { ...state, newTask: { task: action.payload, error: null, loading: false } };
    case UPDATE_TASK:
      return { ...state, updatedTask: { ...state.updatedTask, loading: true } };
    case UPDATE_TASK_SUCCESS:
      return { ...state,
        updatedTask: { task: action.payload, error: null, loading: false }
      };
    case UPDATE_TASK_FAILURE:
      error = action.payload || { message: action.payload };
      return { ...state, updatedTask: { task: null, error, loading: false } };
    case RESET_UPDATED_TASK:
      return { ...state, updatedTask: { task: null, error: null, loading: false } };
    case DELETE_TASK:
      return { ...state, deletedTask: { ...state.deletedTask, loading: true } };
    case DELETE_TASK_SUCCESS: {
      const refreshedState = state;
      refreshedState.tasksList.tasks = state.tasksList.tasks.filter(task =>
        task._id !== action.payload.id
      );
      return { ...refreshedState,
        deletedTask: { task: action.payload, error: null, loading: false }
      };
    }
    case DELETE_TASK_FAILURE:
      error = action.payload || { message: action.payload };
      return { ...state, deletedTask: { task: null, error, loading: false } };
    case RESET_DELETED_TASK:
      return { ...state, deletedTask: { task: null, error: null, loading: false } };
    default:
      return state;
  }
}
