// @flow
import moment from 'moment';
import 'moment-recur';
import { create, update, query, complexQuery, remove } from '../store/pouchDBStore';

// Task List
export const FETCH_TASKS = 'FETCH_TASKS';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';
export const RESET_TASKS = 'RESET_TASKS';

// Get current task
export const GET_CURRENT_TASK = 'GET_CURRENT_TASK';
export const GET_CURRENT_TASK_SUCCESS = 'GET_CURRENT_TASK_SUCCESS';
export const GET_CURRENT_TASK_FAILURE = 'GET_CURRENT_TASK_FAILURE';

// Get task
export const GET_TASK = 'GET_TASK';
export const GET_TASK_SUCCESS = 'GET_TASK_SUCCESS';
export const GET_TASK_FAILURE = 'GET_TASK_FAILURE';

// Create new task
export const CREATE_TASK = 'CREATE_TASK';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE';
export const RESET_NEW_TASK = 'RESET_NEW_TASK';

// Update task
export const UPDATE_TASK = 'UPDATE_TASK';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_FAILURE = 'UPDATE_TASK_FAILURE';
export const RESET_UPDATED_TASK = 'RESET_UPDATED_TASK';

// Query tasks
export const QUERY_TASK = 'QUERY_TASK';
export const QUERY_TASK_SUCCESS = 'QUERY_TASK_SUCCESS';
export const QUERY_TASK_FAILURE = 'QUERY_TASK_FAILURE';

// Delete task
export const DELETE_TASK = 'DELETE_TASK';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILURE = 'DELETE_TASK_FAILURE';
export const RESET_DELETED_TASK = 'RESET_DELETED_TASK';

type TaskType = {
  _id?: string,
  action?: string,
  actionApp?: string,
  actionLink?: string,
  beginAt?: string,
  endAt?: string,
  name?: string,
  visible?: boolean
};

export function fetchTasks(type: string, start?: Date, end?: Date) {
  let request;
  if (type === 'complex') {
    const options = {
      startkey: start,
      endkey: end,
      include_docs: true
    };
    request = complexQuery((doc, emit) => {
      const newDoc = doc;
      const now = moment(start);
      let finished = false;

      if (doc.repeatUntil && now.diff(doc.repeatUntil, 'days') > 0) {
        finished = true;
      }

      if (doc.freq && doc.beginAt && !finished) {
        if (doc.freq === 'weekly' && doc.repeatOn) {
          const today = now.format('dddd');

          let interval;
          if (doc.repeatInterval) {
            interval = moment(doc.beginAt).recur().every(doc.repeatInterval, 'weeks');
          }

          const repeatOn = doc.repeatOn || 'Sunday,Tuesday,Monday,Wednesday,Thursday,Friday,Saturday';
          if (repeatOn.indexOf(today) > -1 && (!interval || interval.matches(now))) {
            const beginAt = moment(doc.beginAt);
            const hours = beginAt.hours();
            const minutes = beginAt.minutes();
            newDoc.beginAt = now.hours(hours).minutes(minutes).format();
          }
        }

        if (doc.freq === 'daily') {
          const beginAt = moment(doc.beginAt);
          const hours = beginAt.hours();
          const minutes = beginAt.minutes();
          newDoc.beginAt = now.hours(hours).minutes(minutes).format();
        }
      }

      emit(newDoc.beginAt);
    }, options, 'tasks');
  } else {
    const filter = {
      selector: {}
    };
    request = query(filter, 'tasks');
  }

  return {
    type: FETCH_TASKS,
    payload: request
  };
}

export function fetchTasksSuccess(tasks?: Object) {
  return {
    type: FETCH_TASKS_SUCCESS,
    payload: tasks
  };
}

export function fetchTasksFailure(error: Object) {
  return {
    type: FETCH_TASKS_FAILURE,
    payload: error
  };
}

export function getCurrentTask() {
  const options = {
    include_docs: true
  };

  const request = complexQuery((doc, emit) => {
    const newDoc = doc;
    const mBeginAt = moment(newDoc.beginAt);
    const mEndAt = moment(newDoc.endAt);
    const beginHours = mBeginAt.hours();
    const beginMinutes = mBeginAt.minutes();
    const endHours = mEndAt.hours();
    const endMinutes = mEndAt.minutes();

    const now = moment();
    let finished = false;

    if (doc.repeatUntil && now.diff(doc.repeatUntil, 'days') > 0) {
      finished = true;
    }

    if (doc.freq && doc.beginAt && !finished) {
      if (doc.freq === 'weekly' && doc.repeatOn) {
        const today = now.format('dddd');

        let interval;
        if (doc.repeatInterval) {
          interval = moment(doc.beginAt).recur().every(doc.repeatInterval, 'weeks');
        }

        const repeatOn = doc.repeatOn || 'Sunday,Tuesday,Monday,Wednesday,Thursday,Friday,Saturday';
        if (repeatOn.indexOf(today) > -1 && (!interval || interval.matches(now))) {
          newDoc.beginAt = now.clone().hours(beginHours).minutes(beginMinutes).format();
          newDoc.endAt = now.clone().hours(endHours).minutes(endMinutes).format();
        }
      }

      if (doc.freq === 'daily') {
        newDoc.beginAt = now.clone().hours(beginHours).minutes(beginMinutes).format();
        newDoc.endAt = now.clone().hours(endHours).minutes(endMinutes).format();
      }
    }

    if (now.diff(moment(newDoc.beginAt)) > 0 && moment(newDoc.endAt).diff(now) > 0) {
      emit(newDoc);
    }
  }, options, 'tasks');


  return {
    type: GET_CURRENT_TASK,
    payload: request
  };
}

export function getCurrentTaskSuccess(tasks?: Object) {
  return {
    type: GET_CURRENT_TASK_SUCCESS,
    payload: tasks
  };
}

export function getCurrentTaskFailure(error: Object) {
  return {
    type: GET_CURRENT_TASK_FAILURE,
    payload: error
  };
}

export function createTask(props: Object) {
  const task = props;

  if (!task._id) {
    const decodedId = `${task.beginAt} ${task.endAt} ${task.name}`;
    task._id = window.btoa(decodedId);
  }

  const request = create(task, 'tasks');

  return {
    type: CREATE_TASK,
    payload: request
  };
}

export function createTaskSuccess(newTask: TaskType) {
  return {
    type: CREATE_TASK_SUCCESS,
    payload: newTask
  };
}

export function createTaskFailure(error: Object) {
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

export function updateTask(props: Object) {
  const request = update(props, 'tasks');

  return {
    type: UPDATE_TASK,
    payload: request
  };
}

export function updateTaskSuccess(updatedTask: TaskType) {
  return {
    type: UPDATE_TASK_SUCCESS,
    payload: updatedTask
  };
}

export function updateTaskFailure(response: Object) {
  return {
    type: UPDATE_TASK_FAILURE,
    payload: response
  };
}

export function getTask(filter: Object) {
  const request = query(filter, 'tasks');

  return {
    type: GET_TASK,
    payload: request
  };
}

export function getTaskSuccess(task: TaskType) {
  return {
    type: GET_TASK_SUCCESS,
    payload: task
  };
}

export function getTaskFailure(error: Object) {
  return {
    type: GET_TASK_FAILURE,
    payload: error
  };
}

export function queryTask(filter: Object) {
  const request = query(filter, 'tasks');

  return {
    type: CREATE_TASK,
    payload: request
  };
}

export function queryTaskSuccess(tasks: Array<TaskType>) {
  return {
    type: CREATE_TASK_SUCCESS,
    payload: tasks
  };
}

export function queryTaskFailure(error: Object) {
  return {
    type: CREATE_TASK_FAILURE,
    payload: error
  };
}

export function deleteTask(task: TaskType) {
  const request = remove(task, 'tasks');

  return {
    type: DELETE_TASK,
    payload: request
  };
}

export function deleteTaskSuccess(deletedTask: TaskType) {
  return {
    type: DELETE_TASK_SUCCESS,
    payload: deletedTask
  };
}

export function deleteTaskFailure(response: Object) {
  return {
    type: DELETE_TASK_FAILURE,
    payload: response
  };
}
