import { create, query } from '../store/pouchDBStore';

// Task List
export const FETCH_TASKS = 'FETCH_TASKS';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';
export const RESET_TASKS = 'RESET_TASKS';

// Create new post
export const CREATE_TASK = 'CREATE_TASK';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE';
export const RESET_NEW_TASK = 'RESET_NEW_TASK';

export function fetchTasks() {
  console.log('fetchTasks');
  const filter = {
    selector: {}
  };
  const request = query(filter, 'tasks')
  console.log('request', request)

  return {
    type: FETCH_TASKS,
    payload: request
  };
}

export function fetchTasksSuccess(posts) {
  return {
    type: FETCH_TASKS_SUCCESS,
    payload: posts
  };
}

export function fetchTasksFailure(error) {
  return {
    type: FETCH_TASKS_FAILURE,
    payload: error
  };
}

export function createTask(props) {
  const request = create(props, 'tasks')

  return {
    type: CREATE_TASK,
    payload: request
  };
}

export function createTaskSuccess(newPost) {
  return {
    type: CREATE_TASK_SUCCESS,
    payload: newPost
  };
}

export function createPostFailure(error) {
  return {
    type: CREATE_TASK_FAILURE,
    payload: error
  };
}

export function resetNewTask() {
  return {
    type: RESET_NEW_TASK
  };
}
