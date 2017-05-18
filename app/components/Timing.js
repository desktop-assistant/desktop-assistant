// @flow
import { shell, remote } from 'electron';
import React, { Component } from 'react';
import moment from 'moment';
import type typeMoment from 'moment';
import _ from 'lodash';
import { exec } from 'child_process';

import styles from './Timing.css';
import Tasks from '../containers/TasksContainer';

type TaskType = {
  _id?: string,
  action?: string,
  actionApp?: string,
  actionLink?: string,
  beginAtDate?: string,
  beginAtTime?: string,
  endAtDate?: string,
  endAtTime?: string,
  name?: string,
  visible?: boolean
};

class Timing extends Component {
  state: {
    date: Date,
    currentTask: TaskType
  };

  constructor() {
    super();

    const win = remote.getCurrentWindow();
    win.setSize(300, 200, true);

    this.state = {
      date: new Date(),
      currentTask: {}
    };
  }

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

  getCurrentTask(dt: typeMoment) {
    return _.find(this.tasksList, task => {
      const beginDate = moment(`${task.beginAtDate}-${task.beginAtTime}`, 'MM-DD-YYYY-HH:mm');
      const endDate = moment(`${task.endAtDate}-${task.endAtTime}`, 'MM-DD-YYYY-HH:mm');

      return dt.diff(beginDate) >= 0 && dt.diff(endDate) < 0;
    });
  }

  tasksList = []
  timerID = 0

  tick() {
    const dt = moment();
    const startOfDay = moment(dt).startOf('day');
    // Difference in minutes
    const secs = dt.diff(startOfDay, 'seconds');
    const pc = (secs / 86400).toFixed(3);
    this.scrollTo = `-${(2880 * +pc) - 100}px`;
    // window.scrollTo(0, scrollTo);
    const currentTask = this.getCurrentTask(dt);

    if (currentTask) {
      const isVisible = !this.state.currentTask ||
        (this.state.currentTask && this.state.currentTask._id !== currentTask._id);
      this.setState({ currentTask });

      if (isVisible) {
        this.show();
      }
    } else {
      this.setState({ currentTask });
    }
  }

  show() {
    const currentTask = this.state.currentTask;
    currentTask.visible = true;
    this.setState({ currentTask });
  }

  dismiss() {
    const currentTask = this.state.currentTask;
    currentTask.visible = false;
    this.setState({ currentTask });
  }

  fireAction() {
    switch (this.state.currentTask.action) {
      case 'link':
        shell.openExternal(this.state.currentTask.actionLink);
        break;
      case 'app':
        exec(`open -n ${String(this.state.currentTask.actionApp)}`);
        break;
      default:
        console.error('no action specified');
    }
  }

  render() {
    return (
      <div className={styles.timing} style={{ 'margin-top': this.scrollTo }}>
        {this.state.currentTask &&
          <button className={styles.showCurrentTask} onClick={this.show.bind(this)}>
            <i className={styles.showCurrentTaskIcon} aria-hidden="true" />
          </button>
        }
        {this.state.currentTask && this.state.currentTask.visible &&
          <div className={styles.currentTask}>
            <h1>{this.state.currentTask.name}</h1>
            <button className={styles.actionButton} onClick={this.fireAction.bind(this)}>
              <i className="fa fa-bolt" aria-hidden="true" />
            </button>
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
