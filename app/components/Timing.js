/* eslint-disable flowtype-errors/show-errors */
// @flow
import { shell, remote } from 'electron';
import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { exec } from 'child_process';

import styles from './Timing.css';
import Tasks from '../containers/TasksContainer';

class Timing extends Component {
  constructor() {
    super();

    const win = remote.getCurrentWindow();
    win.setSize(300, 200, true);

    this.state = {
      date: new Date(),
      currentTaskVisible: false
    };
  }

  state: {
    date: Object,
    currentTaskVisible: boolean
  };

  componentDidMount() {
    setTimeout(() => {
      const now = moment();
      const minPLuSOne = moment(now).minutes() + 1;
      const minUp = moment(now).minutes(minPLuSOne);
      const dateTillStart = minUp.seconds(0).milliseconds(0);
      const timeToWait = moment(dateTillStart).diff(now, 'milliseconds');

      this.tick();
      setTimeout(() => {
        this.tick();
        this.timerID = setInterval(
          () => this.tick(),
          60 * 1000 // each min
        );
      }, timeToWait);
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getCurrentTask(dt) {
    return _.find(this.tasksList, task => {
      const beginDate = moment(`${task.beginAtDate}-${task.beginAtTime}`, 'MM-DD-YYYY-h:mm');
      const endDate = moment(`${task.endAtDate}-${task.endAtTime}`, 'MM-DD-YYYY-h:mm');

      return dt.diff(beginDate) >= 0 && dt.diff(endDate) < 0;
    });
  }

  tick() {
    const dt = moment();
    const startOfDay = moment(dt).startOf('day');
    // Difference in minutes
    const secs = dt.diff(startOfDay, 'seconds');
    const pc = (secs / 86400).toFixed(3);
    window.scrollTo(0, (2880 * pc) - 106);

    this.currentTask = this.getCurrentTask(dt);

    if (this.currentTask) {
      this.show();
    }

    this.setState({
      date: dt,
      pc,
      top: `${top}`
    });
  }

  show() {
    this.setState({ currentTaskVisible: true });
  }

  dismiss() {
    this.setState({ currentTaskVisible: false });
  }

  fireAction() {
    switch (this.currentTask.action) {
      case 'link':
        shell.openExternal(this.currentTask.actionLink);
        break;
      case 'app':
        exec(`open -n ${this.currentTask.actionApp}`);
        break;
      default:
        console.error('no action specified');
    }
  }

  render() {
    return (
      <div className={styles.timing}>
        {this.currentTask && !this.state.currentTaskVisible &&
          <div className={styles.showCurrentTask} onClick={this.show.bind(this)}>
            <i className={styles.showCurrentTaskIcon} aria-hidden="true" />
          </div>
        }
        {this.currentTask && this.state.currentTaskVisible &&
          <div className={styles.currentTask}>
            <h1>{this.currentTask.name}</h1>
            <div className={styles.actionButton} onClick={this.fireAction.bind(this)}>
              <i className="fa fa-bolt" aria-hidden="true" />
            </div>
            <button onClick={this.dismiss.bind(this)}>dismiss</button>
          </div>
        }
        {Array(24).fill(1).map((el, i) =>
          <div className={styles.hour} title={`${i}:00`} />
        )}
        <Tasks updateTasks={tasks => (this.tasksList = tasks)} />
      </div>
    );
  }
}

export default Timing;
