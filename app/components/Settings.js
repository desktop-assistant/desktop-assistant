// @flow
import { remote } from 'electron';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import styles from './Settings.scss';
import { exportDB, importDB, destroyDB } from '../store/pouchDBStore';

export default class Settings extends Component {
  props: {
    settings: Object,
    fetchSettings: () => void,
    syncGCalendar: () => void,
    resetSettings: () => void
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
    destroyDB('tasks');
  }

  componentWillMount() {
    this.props.fetchSettings();
  }

  gcalSync() {
    this.props.syncGCalendar();
  }

  resetSettings() {
    this.props.resetSettings();
  }

  render() {
    const {
      settings
    } = this.props.settings;
    return (
      <div>
        <div className={`${styles.container}`}>
          <Link to="/" className={`${styles.backButton}`}>
            <i className="fa fa-chevron-left" />
          </Link>
          <section>
            <article>
              <h2>Google Calendar Sync</h2>
              {
                settings && settings.googleCalSync && settings.googleCalSync.synchronized &&
                  <div className={styles.synchronized}>
                    Last sync : {moment(settings.googleCalSync.lastSync).fromNow()}
                  </div>
              }
              <button onClick={this.gcalSync.bind(this)}>Synchronize</button>
            </article>
            <article>
              <h2>Import / Export Database</h2>
              <button onClick={Settings.export}>Export</button>
              <button onClick={Settings.import}>Import</button>
            </article>
            <article>
              <h2>Clear data / settings</h2>
              <button onClick={Settings.clearData}>Clear Data</button>
              <button onClick={this.resetSettings.bind(this)}>Reset Settings</button>
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
