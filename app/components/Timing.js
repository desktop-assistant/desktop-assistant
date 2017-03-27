/* eslint-disable flowtype-errors/show-errors */
// @flow
import React, { Component } from 'react';
import moment from 'moment';

import styles from './Timing.css';
import Tasks from '../containers/TasksContainer';


class Timing extends Component {
  constructor() {
    super();
    this.state = { date: new Date() };
  }

  state: {
    date: Object
  };

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    const dt = moment();
    const startOfDay = moment(dt).startOf('day');
    // Difference in minutes
    const secs = dt.diff(startOfDay, 'seconds');
    const pc = (secs / 86400).toFixed(3);
    window.scrollTo(0, (4800 * pc) - 106);

    this.setState({
      date: dt,
      pc,
      top: `${top}`
    });
  }

  render() {
    return (
      <div className={styles.timing}>
        {Array(24).fill(1).map((el, i) =>
          <div className={styles.hour} title={`${i}h`} />
        )}
        <Tasks />
      </div>
    );
  }
}

export default Timing;
