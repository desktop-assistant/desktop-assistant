/* eslint-disable class-methods-use-this */
// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { remote } from 'electron';

import Task from '../containers/TaskContainer';
import styles from './Tasks.css';

/* eslint-disable react/prop-types */
export default class Tasks extends Component {
  constructor() {
    super();
    this.state = {
      selectedTask: ''
    };
  }

  state: {
    selectedTask: string
  };

  componentWillMount() {
    this.props.fetchTasks();
  }

  componentDidMount() {
    // const win = remote.getCurrentWindow();
    // win.on('move', () => {
    //   console.log('move');
    //   this.setState({ selectedTask: '' });
    // });
  }

  props: {
    updateTask: () => void,
    updateTasks: () => void,
    fetchTasks: () => void,
    tasksList: {
      tasks: Array<Object>
      // loading: boolean
    }
  }

  resizeTask(task, dir, delta) {
    const newTask = task;
    const diffTime = delta * 0.5;
    const beginDate = moment(`${task.beginAtDate}-${task.beginAtTime}`, 'MM-DD-YYYY-H:m');
    const endDate = moment(`${task.endAtDate}-${task.endAtTime}`, 'MM-DD-YYYY-H:m');

    if (dir === 'top') {
      beginDate.subtract(diffTime, 'minutes');
      newTask.beginAtDate = beginDate.format('MM-DD-YYYY');
      newTask.beginAtTime = beginDate.format('H:m');
    }

    if (dir === 'bottom') {
      endDate.add(diffTime, 'minutes');
      newTask.endAtDate = endDate.format('MM-DD-YYYY');
      newTask.endAtTime = endDate.format('H:m');
    }

    this.props.updateTask(newTask);
    this.props.fetchTasks();
  }

  moveTask(task, newPosition) {
    const newTask = task;
    const beginMinutes = newPosition * 0.5;

    const beginDate = moment(`${task.beginAtDate}-${task.beginAtTime}`, 'MM-DD-YYYY-H:m');
    const endDate = moment(`${task.endAtDate}-${task.endAtTime}`, 'MM-DD-YYYY-H:m');
    const duration = endDate.diff(beginDate, 'minutes');

    beginDate.hour(0).minutes(beginMinutes);
    endDate.hour(0).minutes(beginMinutes + duration);

    newTask.beginAtDate = beginDate.format('MM-DD-YYYY');
    newTask.beginAtTime = beginDate.format('H:m');

    newTask.endAtDate = endDate.format('MM-DD-YYYY');
    newTask.endAtTime = endDate.format('H:m');

    this.props.updateTask(newTask);
    this.props.fetchTasks();
  }

  reFetchTasks() {
    this.props.fetchTasks();
  }

  handleTaskClick(taskId: string) {
    const win = remote.getCurrentWindow();
    if (this.state.selectedTask === taskId) {
      this.setState({ selectedTask: '' });
      win.setMovable(true);
    } else {
      this.setState({ selectedTask: taskId });
      win.setMovable(false);
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
          const beginDate = moment(`${task.beginAtDate}-${task.beginAtTime}`, 'MM-DD-YYYY-h:mm');
          if (task && beginDate.isSame(moment(), 'day')) {
            return (
              <div onClick={() => this.handleTaskClick(task._id)} key={task._id}>
                <Task
                  task={task} reFetchTasks={this.reFetchTasks.bind(this)}
                  moveTask={this.moveTask.bind(this)}
                  resizeTask={this.resizeTask.bind(this)}
                  selected={this.state.selectedTask === task._id}
                />
              </div>
            );
          }
          return '';
        })}
      </div>
    );
  }
}
