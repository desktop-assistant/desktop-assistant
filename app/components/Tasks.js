/* eslint-disable class-methods-use-this */
// @flow
import electron from 'electron';
import React, { Component } from 'react';

import Task from './Task';
import styles from './Tasks.css';

/* eslint-disable react/prop-types */
export default class Tasks extends Component {
  componentWillMount() {
    this.props.fetchTasks();
  }

  props: {
    updateTasks: () => void,
    fetchTasks: () => void,
    tasksList: {
      tasks: Array<Object>
      // loading: boolean
    }
  }

  render() {
    const {
      tasks
    } = this.props.tasksList;
    this.props.updateTasks(this.props.tasksList.tasks);
    return (
      <div className={styles.tasks}>
        {tasks.map(task => {
          if (task) {
            return (<Task key={task._id} task={task} />);
          }
          return '';
        })}
      </div>
    );
  }
}
