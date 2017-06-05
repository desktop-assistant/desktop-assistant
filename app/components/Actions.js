// @flow
import React, { Component } from 'react';
import { remote, screen } from 'electron';
import { Link } from 'react-router-dom';
import styles from './Actions.scss';

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
          <button className={styles.settingsButton}>
            <Link to="/settings">
              <i className="fa fa-cog" />
            </Link>
          </button>
          <button className={styles.expandButton}>
            <a onClick={this.expandWindow.bind(this)}>
              <i className={`fa ${this.state.expanded ? 'fa-angle-double-up' : 'fa-angle-double-down'}`} />
            </a>
          </button>
        </div>
        <div className={styles.bottomActions}>
          <button className={styles.addTaskButton}>
            <Link to="/add">
              <i className="fa fa-plus" />
            </Link>
          </button>
        </div>
      </div>
    );
  }
}
