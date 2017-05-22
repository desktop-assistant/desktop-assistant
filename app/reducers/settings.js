// @flow
import {
  FETCH_SETTINGS, FETCH_SETTINGS_SUCCESS, FETCH_SETTINGS_FAILURE,
  SYNC_GCALENDAR
} from '../actions/settings';

const INITIAL_STATE = {
  settings: {
    sync: {
      sync: false
    },
    error: null,
    loading: false
  }
};

export type StateType = {
  settings: {
    sync: {
      sync?: boolean
    }
  }
};

type actionType = {
  type: string
};

export default function (state: StateType = INITIAL_STATE, action: actionType) {
  let error;
  switch (action.type) {
    case FETCH_SETTINGS:// start fetching settings and set loading = true
      return { ...state, settings: { sync: { gcalSync: false }, error: null, loading: true } };
    case FETCH_SETTINGS_SUCCESS:// return list of settings and make loading = false
      return { ...state, settings: { sync: action.payload[0], error: null, loading: false } };
    case FETCH_SETTINGS_FAILURE:// return error and make loading = false
      // 2nd one is network or server down errors
      error = action.payload || { message: action.payload.message };
      return { ...state, settings: { sync: { gcalSync: false }, error, loading: false } };
    case SYNC_GCALENDAR:
      return { ...state, settings: { sync: { gcalSync: true } } };
    default:
      return state;
  }
}
