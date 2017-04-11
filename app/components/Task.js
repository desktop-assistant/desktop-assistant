/* eslint-disable class-methods-use-this */
// @flow
import electron from 'electron';
import React, { Component } from 'react';

import styles from './Task.css';

function timeStringToFloat(time) {
  const hoursMinutes = time.split(/[.:h]/);
  const hours = parseInt(hoursMinutes[0], 10);
  const minutes = parseInt(hoursMinutes[1], 10);
  const floatValue = hours + (minutes / 60);
  return floatValue;
}

function getTaskHeight(beginTime, endTime) {
  const duration = timeStringToFloat(endTime) - timeStringToFloat(beginTime);
  return duration * 200;
}

/* eslint-disable react/prop-types */
export default class Task extends Component {
  constructor() {
    super();
    console.log('props', this.props);
  }

  handleLinkClick() {
    const shell = electron.shell;
    // open links externally by default
    shell.openExternal('https://call_to_action');
  }

  render() {
    const {
      task
    } = this.props;
    return (
      <div
        className={styles.task}
        style={{
          top: `${timeStringToFloat(task.beginAtTime) * 200}px`,
          height: `${getTaskHeight(task.beginAtTime, task.endAtTime)}px`
        }}
      >
        <h3>{ task.name }</h3>
        <div>{ task.beginAtTime } - { task.endAtTime }</div>
      </div>
    );
  }
}
