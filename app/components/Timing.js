/* eslint-disable flowtype-errors/show-errors */
// @flow
import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

import styles from './Timing.css';
import Tasks from '../containers/TasksContainer';

class Timing extends Component {
  constructor() {
    super();
    this.state = {
      date: new Date(),
      showCurrentTask: true
    };
  }

  state: {
    date: Object,
    showCurrentTask: boolean
  };

  componentDidMount() {
    setTimeout(() => {
      const now = moment();
      const minUp = moment(now).minutes(moment(now).minutes() + 1);
      const dateTillStart = moment(now).minutes(minUp).seconds(0).millisecond(0);
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
    window.scrollTo(0, (4800 * pc) - 106);

    this.currentTask = this.getCurrentTask(dt);

    this.setState({
      date: dt,
      pc,
      top: `${top}`
    });
  }

  show() {
    this.setState({ showCurrentTask: true });
  }

  dismiss() {
    this.setState({ showCurrentTask: false });
  }

  render() {
    return (
      <div className={styles.timing}>
        {this.currentTask && !this.state.showCurrentTask &&
          <div className={styles.showCurrentTask} onClick={this.show.bind(this)}>
            <i className={styles.showCurrentTaskIcon} aria-hidden="true" />
          </div>
        }
        {this.currentTask && this.state.showCurrentTask &&
          <div className={styles.currentTask}>
            <h1>{this.currentTask.name}</h1>
            <div className={styles.actionButton}>
              <i className="fa fa-bolt" aria-hidden="true" />
            </div>
            <button onClick={this.dismiss.bind(this)}>dismiss</button>
          </div>
        }
        {Array(24).fill(1).map((el, i) =>
          <div className={styles.hour} title={`${i}h`} />
        )}
        <Tasks updateTasks={tasks => (this.tasksList = tasks)} />
      </div>
    );
  }
}

export default Timing;
