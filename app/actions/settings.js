// @flow
import { syncGoogleCalendar } from '../store/settingsStore';
import { query, destroyDB } from '../store/pouchDBStore';

export const FETCH_SETTINGS = 'FETCH_SETTINGS';
export const FETCH_SETTINGS_SUCCESS = 'FETCH_SETTINGS_SUCCESS';
export const FETCH_SETTINGS_FAILURE = 'FETCH_SETTINGS_FAILURE';

export const SYNC_GCALENDAR = 'SYNC_GCALENDAR';
export const SYNC_GCALENDAR_SUCCESS = 'SYNC_GCALENDAR_SUCCESS';
export const SYNC_GCALENDAR_FAILURE = 'SYNC_GCALENDAR_FAILURE';

export const RESET_SETTINGS = 'RESET_SETTINGS';

export function fetchSettings() {
  const filter = {
    selector: {}
  };
  const request = query(filter, 'settings');

  return {
    type: FETCH_SETTINGS,
    payload: request
  };
}

export function fetchSettingsSuccess(config: Object) {
  return {
    type: FETCH_SETTINGS_SUCCESS,
    payload: config
  };
}

export function fetchSettingsFailure(error: Object) {
  return {
    type: FETCH_SETTINGS_FAILURE,
    payload: error
  };
}

export function resetSettings() {
  const request = destroyDB('settings');

  return {
    type: RESET_SETTINGS,
    payload: request
  };
}

export async function syncGCalendar() {
  const request = await syncGoogleCalendar();
  return {
    type: SYNC_GCALENDAR,
    payload: request
  };
}
