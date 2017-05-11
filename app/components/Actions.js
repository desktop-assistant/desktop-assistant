// @flow
import React, { Component } from 'react';
import { remote, screen } from 'electron';
import { Link } from 'react-router-dom';
import styles from './Actions.css';
// import { syncWith } from '../store/pouchDBStore';

export default class Actions extends Component {
  state: {
    expanded: boolean
  };

  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  previousPosition = []
  previousSize = []

  // syncDB() {
  //   syncWith('http://localhost:5984/');
  // }

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
        <div className={styles.topActions}>
          <div className={styles.settings}>
            <Link to="/settings" className={styles.settingsButton}>
              <i className="fa fa-cog" />
            </Link>
          </div>
          <div className={styles.expand}>
            <button onClick={this.expandWindow.bind(this)} className={styles.expandButton}>
              <i className={`fa ${this.state.expanded ? 'fa-angle-double-up' : 'fa-angle-double-down'}`} />
            </button>
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
