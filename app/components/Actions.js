// @flow
import React, { Component } from 'react';
import { remote, screen } from 'electron';
import { Link } from 'react-router';
import styles from './Actions.css';
import { syncWith } from '../store/pouchDBStore';


export default class Actions extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  state: {
    expanded: boolean
  };

  previousPosition = []
  previousSize = []

  syncDB() {
    syncWith('http://localhost:5984/');
  }

  expandWindow() {
    const mainScreen = screen.getPrimaryDisplay();
    const win = remote.getCurrentWindow();

    if (this.state.expanded) {
      this.setState({ expanded: false });
      win.setPosition(this.previousPosition[0], this.previousPosition[1], true);
      win.setSize(this.previousSize[0], this.previousSize[1], true);
    } else {
      this.setState({ expanded: true });
      this.previousPosition = win.getPosition();
      this.previousSize = win.getSize();
      win.setPosition(this.previousPosition[0], 0, true);
      win.setSize(300, mainScreen.workArea.height, true);
    }
  }

  render() {
    return (
      <div>
        {/* <div className={styles.sync}>
          <a onClick={this.syncDB} className={styles.syncButton}>
            <i className="fa fa-refresh" />
          </a>
        </div> */}
        <div className={styles.topActions}>
          <div className={styles.expand}>
            <a onClick={this.expandWindow.bind(this)} className={styles.expandButton}>
              <i className={`fa ${this.state.expanded ? 'fa-angle-double-up' : 'fa-angle-double-down'}`} />
            </a>
          </div>
        </div>
        <div className={styles.bottomActions}>
          <div className={styles.add}>
            <Link to="/add" className={styles.addTaskButton}>
              <i className="fa fa-plus" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
