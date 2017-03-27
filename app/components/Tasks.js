// @flow
import electron from 'electron';
import React, { Component } from 'react';
import styles from './Tasks.css';

function timeStringToFloat(time) {
  let hoursMinutes = time.split(/[.:h]/);
  let hours = parseInt(hoursMinutes[0], 10);
  let minutes = parseInt(hoursMinutes[1], 10);
  let floatValue = hours + minutes / 60;
  return floatValue;
}

function getTaskHeight(beginTime, endTime) {
  const duration = timeStringToFloat(endTime) - timeStringToFloat(beginTime)
  return duration * 200;
}

export default class Tasks extends Component {
  componentWillMount() {
    this.props.fetchTasks();
  }

  handleLinkClick() {
    const shell = electron.shell;
    // open links externally by default
    shell.openExternal('https://call_to_action');
  }

  render() {
    const { tasks, loading, error } = this.props.tasksList;
    return (
      <div className={styles.tasks}>
        {tasks.map((task, i) => {
          if (task.beginAtDate && task.endAtDate) {
            return <div
              className={styles.task}
              style={{
                top: timeStringToFloat(task.beginAtTime) * 200 + 'px',
                height: getTaskHeight(task.beginAtTime, task.endAtTime) + 'px'
              }}>
              <h3>{ task.name }</h3>
              <div>{ task.beginAt } - { task.endAt }</div>
              <div>
                <a href="#" onClick={this.handleLinkClick}><i className="fa fa-external-link" aria-hidden="true"></i> Open Hangout</a>
              </div>
            </div>
          }
        })}
      </div>
    );
  }
}
