// @flow
import electron from 'electron';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Settings.scss';
console.log('styles', styles);

import { exportDB, importDB, destroyDB } from '../store/pouchDBStore';

export default class Settings extends Component {
  static export() {
    const { dialog } = electron.remote;
    dialog.showOpenDialog({
      buttonLabel: 'Export',
      defaultPath: '~/Desktop/',
      properties: ['openDirectory', 'createDirectory']
    }, path => {
      exportDB(path[0]);
    });
  }

  static import() {
    const { dialog } = electron.remote;
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

  render() {
    return (
      <div className={styles.container}>
        <Link to="/" className={styles.backButton}>
          <i className="fa fa-chevron-left" />
        </Link>
        <section>
          <article>
            <h2>Import / Export Database</h2>
            <button onClick={() => (Settings.export())}>Export</button>
            <button onClick={() => (Settings.import())}>Import</button>
          </article>
          <article>
            <h2>Clear all data</h2>
            <button onClick={() => (Settings.clearData())}>Clear Data</button>
            <p>
              IMPORTANT : You will lose all your tasks and app settings.
              This action is irreversible !
            </p>
          </article>
        </section>
      </div>
    );
  }
}
