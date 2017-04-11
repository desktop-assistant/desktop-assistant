// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Actions.css';
import { syncWith } from '../store/pouchDBStore';


export default class Actions extends Component {
  syncDB() {
    syncWith('http://localhost:5984/');
  }

  render() {
    return (
      <div className={styles.actions}>
        <div className={styles.sync}>
          <a onClick={this.syncDB} className={styles.syncButton}>
            <i className="fa fa-refresh" />
          </a>
        </div>
        <div className={styles.add}>
          <Link to="/add" className={styles.addTaskButton}>
            <i className="fa fa-plus" />
          </Link>
        </div>
      </div>
    );
  }
}
