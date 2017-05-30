// @flow
import { parse } from 'url';
import { remote } from 'electron';
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import _ from 'lodash';
import { create, query } from '../store/pouchDBStore';
import { configureStore } from './configureStore';
import { queryTask, createTask } from '../actions/tasks';

let config = {};
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  config = require('../config').config;
}

const store = configureStore();

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || _.get(config, 'googleClientId');
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || _.get(config, 'googleClientSecret');
const GOOGLE_REDIRECT_URI = 'http://localhost:1212';
const GOOGLE_GET_EVENT_LIST_URL = 'https://www.googleapis.com/calendar/v3/calendars/calendarId/events';

function signInWithPopup() {
  return new Promise((resolve, reject) => {
    const authWindow = new remote.BrowserWindow({
      width: 500,
      height: 600,
      show: true,
    });

    const urlParams = {
      response_type: 'code',
      redirect_uri: GOOGLE_REDIRECT_URI,
      client_id: GOOGLE_CLIENT_ID,
      scope: 'profile email https://www.googleapis.com/auth/calendar',
    };
    const authUrl = `${GOOGLE_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`;

    function handleNavigation(url) {
      const query = parse(url, true).query;
      if (query) {
        if (query.error) {
          reject(new Error(`There was an error: ${query.error}`));
        } else if (query.code) {
          // Login is complete
          authWindow.removeAllListeners('closed');
          setImmediate(() => authWindow.close());

          // This is the authorization code we need to request tokens
          resolve(query.code);
        }
      }
    }

    authWindow.on('closed', () => {
      // TODO: Handle this smoothly
      throw new Error('Auth window was closed by user');
    });

    authWindow.webContents.on('will-navigate', (event, url) => {
      handleNavigation(url);
    });

    authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      handleNavigation(newUrl);
    });

    authWindow.loadURL(authUrl);
  });
}

async function fetchAccessTokens(code: string) {
  const response = await axios.post(GOOGLE_TOKEN_URL, qs.stringify({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
}

async function fetchGoogleProfile(accessToken: string) {
  const response = await axios.get(GOOGLE_PROFILE_URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

async function googleSignIn() {
  const code = await signInWithPopup();
  const tokens = await fetchAccessTokens(code);
  const { id, email, name } = await fetchGoogleProfile(tokens.access_token);
  const providerUser = {
    uid: id,
    email,
    displayName: name,
    idToken: tokens.id_token,
    accessToken: tokens.access_token
  };

  return providerUser;
}

async function getEvents(accessToken, calendarId) {
  const url = GOOGLE_GET_EVENT_LIST_URL.replace('calendarId', calendarId);
  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      timeMin: moment().hour(0).format()
    }
  });
  return response.data.items;
}

async function convertEvents(events: Array<Object>) {
  for (const event of events) {
    if (event.start && event.end) {
      const start = moment(event.start.dateTime);
      const end = moment(event.end.dateTime);
      const task = {
        name: event.summary,
        beginAt: start.toISOString(),
        endAt: end.toISOString(),
        source: 'google calendar',
        sourceLink: event.htmlLink,
        location: event.location,
        dataSource: event,
      };
      if (event.hangoutLink) {
        const decodedId = `${event.id} google-calendar`;
        task._id = window.btoa(decodedId);
        task.action = 'link';
        task.actionLink = event.hangoutLink;
        task.actionLinkType = 'hangout';
      }

      if (event.recurrence && event.recurrence.length) {
        const recurrence = event.recurrence[0];
        const freq = getValueFromStr('FREQ', recurrence);
        const repeatOn = getValueFromStr('BYDAY', recurrence);
        task.freq = freq.toLowerCase();
        task.repeatOn = formatRepeatOn(repeatOn);
      }

      try {
        const encodedId = window.btoa(`${event.id} google-calendar`);
        const result = await store.dispatch(queryTask({ selector: { _id: encodedId } }));

        if (result && result.payload.docs && result.payload.docs.length && result.payload.docs[0]._rev) {
          task._rev = result.payload.docs[0]._rev;
        }
      } catch (err) {
        console.error('err', err);
      }

      store.dispatch(createTask(task));
    }
  }
}

function getValueFromStr(key, str) {
  return str.split(`${key}=`).pop().split(';').shift();
}

function formatRepeatOn(gCalReapeatOn) {
  const resArray = [];
  const conv = {
    SU: 'Sunday',
    MO: 'Monday',
    TU: 'Tuesday',
    WE: 'Wednesday',
    TH: 'Thursday',
    FR: 'Friday',
    SA: 'Saturday'
  };

  const gDays = gCalReapeatOn.split(',');

  for (const gDay of gDays) {
    resArray.push(conv[gDay]);
  }

  return resArray.toString();
}

export async function syncGoogleCalendar(check?: boolean) {
  let accessToken;
  const gSyncConf = await query({ selector: { _id: 'google-calendar-sync' } }, 'settings');

  const isSynced = _.get(gSyncConf, 'docs[0].synchronized');
  if (check && !isSynced) {
    return false;
  }

  const token = _.get(gSyncConf, 'docs[0].token');

  if (!token) {
    const googleProvider = await googleSignIn();
    accessToken = googleProvider.accessToken;
  } else {
    accessToken = token;
  }

  if (accessToken) {
    const syncConf = {
      _id: 'google-calendar-sync',
      token: accessToken,
      synchronized: true,
      lastSync: new Date()
    };

    if (gSyncConf && gSyncConf.docs && gSyncConf.docs.length) {
      syncConf._rev = gSyncConf.docs[0]._rev;
    }
    create(syncConf, 'settings');
    const events = await getEvents(accessToken, 'primary');

    convertEvents(events);
  }
}
