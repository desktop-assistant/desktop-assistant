// @flow
import { parse } from 'url';
import { remote } from 'electron';
import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styles from './Settings.scss';
import { exportDB, importDB, destroyDB } from '../store/pouchDBStore';

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me';
const GOOGLE_CLIENT_ID = '336907596898-mmk307fbmj3uo3jkgj04bcnpdbqlg9ur.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'naKusw2b1Y9cpOg8xaWmPejy';
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

export async function fetchAccessTokens(code: string) {
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

export async function fetchGoogleProfile(accessToken: string) {
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

export default class Settings extends Component {
  props: {
    createTask: () => Object
  };

  static export() {
    const { dialog } = remote;
    dialog.showOpenDialog({
      buttonLabel: 'Export',
      defaultPath: '~/Desktop/',
      properties: ['openDirectory', 'createDirectory']
    }, path => {
      exportDB(path[0]);
    });
  }

  static import() {
    const { dialog } = remote;
    dialog.showOpenDialog({
      buttonLabel: 'Import',
      defaultPath: '~/Desktop/',
      properties: ['openFile']
    }, fileName => {
      importDB(fileName[0]);
    });
  }

  static clearData() {
    destroyDB();
  }

  static async getEvents(accessToken, calendarId) {
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

  async convertEvents(events: Array<Object>) {
    for (const event of events) {
      if (event.start && event.end) {
        const start = moment(event.start.dateTime);
        const end = moment(event.end.dateTime);
        const task = {
          name: event.summary,
          beginAtDate: start.format('MM-DD-YYYY'),
          beginAtTime: start.format('H:m'),
          endAtDate: end.format('MM-DD-YYYY'),
          endAtTime: end.format('H:m'),
          source: 'google calendar',
          sourceLink: event.htmlLink,
          dataSource: event
        };
        if (event.hangoutLink) {
          const decodedId = `${event.id} google-calendar`;
          task._id = window.btoa(decodedId);
          task.action = 'link';
          task.actionLink = event.hangoutLink;
          task.actionLinkType = 'hangout';
        }

        try {
          const encodedId = window.btoa(`${event.id} google-calendar`);
          const result = await this.props.queryTask({ selector: { _id: encodedId } });
          if (result && result.payload.docs.length && result.payload.docs[0]._rev) {
            task._rev = result.payload.docs[0]._rev;
          }
        } catch (err) {
          console.log('err', err);
        }
        this.props.createTask(task);
      }
    }
  }

  async gcalSync() {
    const googleProvider = await googleSignIn();
    const accessToken = googleProvider.accessToken;
    const events = await Settings.getEvents(accessToken, 'primary');
    this.convertEvents(events);
  }

  render() {
    return (
      <div>
        <div className={`${styles.container}`}>
          <Link to="/" className={`${styles.backButton}`}>
            <i className="fa fa-chevron-left" />
          </Link>
          <section>
            <article>
              <h2>Google Calendar Sync</h2>
              <button onClick={this.gcalSync.bind(this)}>Synchronize</button>
            </article>
            <article>
              <h2>Import / Export Database</h2>
              <button onClick={Settings.export}>Export</button>
              <button onClick={Settings.import}>Import</button>
            </article>
            <article>
              <h2>Clear all data</h2>
              <button onClick={Settings.clearData}>Clear Data</button>
              {/* <p>
                IMPORTANT : You will lose all your tasks and app settings.
                This action is irreversible !
              </p> */}
            </article>
          </section>
        </div>
      </div>
    );
  }
}
