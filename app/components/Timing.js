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
  endAt?: string,
  beginAt?: string,
  name?: string,
  visible?: boolean,
  action?: string,
  actionApp?: string,
  actionLink?: string
};

class Timing extends Component {
  state: {
    showTask: boolean,
    currentDay: typeMoment
  };

  props: {
    getCurrentTask: () => void,
    currentTask: {
      task?: TaskType
    }
  }

  constructor() {
    super();

    const win = remote.getCurrentWindow();
    win.setSize(300, 200, true);

    this.state = {
      showTask: true,
      currentDay: moment()
    };
  }

  componentWillMount() {
    clearInterval(this.timerID);
    this.props.getCurrentTask();
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

  timerID = 0
  scrollTo = 0

  tick() {
    const dt = moment();
    const startOfDay = moment(dt).startOf('day');
    // Difference in minutes
    const secs = dt.diff(startOfDay, 'seconds');
    const pc = (secs / 86400).toFixed(3);
    this.scrollTo = `-${(2880 * +pc) - 100}px`;
    // window.scrollTo(0, scrollTo);
    this.props.getCurrentTask();
  }

  show() {
    this.setState({ showTask: true });
  }

  dismiss() {
    this.setState({ showTask: false });
  }

  fireAction() {
    const task = this.props.currentTask.task;
    if (task) {
      switch (task.action) {
        case 'link':
          shell.openExternal(task.actionLink);
          break;
        case 'app':
          exec(`open -n ${String(task.actionApp)}`);
          break;
        default:
          console.error('no action specified');
      }
    }
  }

  render() {
    const {
      task
    } = this.props.currentTask;
    return (
      <div className={styles.container} style={{ 'margin-top': this.scrollTo }}>
        { !moment().diff(this.state.currentDay, 'days') &&
          <div>
            <div className={styles.leftTimeIndication} />
            <div className={styles.rightTimeIndication} />
          </div>
        }
        <div className={styles.currentTaskContainer}>
          {task &&
            <button className={styles.showCurrentTask} onClick={this.show.bind(this)}>
              <i className={styles.showCurrentTaskIcon} aria-hidden="true" />
            </button>
          }
        </div>
        {task && this.state.showTask &&
          <div className={styles.currentTask}>
            <h1>{task.name}</h1>
            <button className={styles.actionButton} onClick={this.fireAction.bind(this)}>
              <i className="fa fa-bolt" aria-hidden="true" />
            </button>
            <button onClick={this.dismiss.bind(this)}>dismiss</button>
          </div>
        }
        {Array(24).fill(1).map((el, i) =>
          <div className={styles.hour} title={`${i}:00`} />
        )}
        <Tasks currentDay={this.state.currentDay} />
      </div>
    );
  }
}

export default Timing;
