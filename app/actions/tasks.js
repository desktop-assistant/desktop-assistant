// @flow
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
  const filter = {
    selector: {}
  };
  const request = query(filter, 'tasks');

  return {
    type: FETCH_TASKS,
    payload: request
  };
}

export function fetchTasksSuccess(posts: Array<Object>) {
  return {
    type: FETCH_TASKS_SUCCESS,
    payload: posts
  };
}

export function fetchTasksFailure(error: Object) {
  return {
    type: FETCH_TASKS_FAILURE,
    payload: error
  };
}

export function createTask(props: Object) {
  const request = create(props, 'tasks');

  return {
    type: CREATE_TASK,
    payload: request
  };
}

export function createTaskSuccess(newPost: Object) {
  return {
    type: CREATE_TASK_SUCCESS,
    payload: newPost
  };
}

export function createPostFailure(error: Object) {
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
