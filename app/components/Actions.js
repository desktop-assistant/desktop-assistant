// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Actions.css';


export default class Actions extends Component {
  render() {
    return (
      <div className={styles.actions}>
        <div className={styles.add}>
          <Link to="/add" className={styles.addTaskButton}>
            <i className="fa fa-plus" />
          </Link>
        </div>
      </div>
    );
  }
}
