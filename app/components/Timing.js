// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Timing.css';
import moment from 'moment';
import Tasks from '../containers/TasksContainer';


class Timing extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

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
    var dt = moment();
    // dt = dt.utc().add(dt.utcOffset(), 'm');
    var startOfDay = moment(dt).startOf('day');
    // Difference in minutes
    var secs = dt.diff(startOfDay, 'seconds');
    // var secs = moment.duration().seconds();
    var pc = (secs / 86400).toFixed(3);
    window.scrollTo(0, 4800 * pc - 106);

    this.setState({
      date: dt,
      pc: pc,
      top: `${ top }`
    });
  }

  render() {
    // { moment(this.state.date).format('h:mm:ss') }
    return (
      <div className={styles.timing}>
        {Array(24).fill(1).map((el, i) =>
          <div className={styles.hour}>
            { i }h
          </div>
        )}
        <Tasks></Tasks>
      </div>
    );
  }
}

export default Timing;
