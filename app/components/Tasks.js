// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { remote } from 'electron';

import Task from '../containers/TaskContainer';
import styles from './Tasks.css';

type TaskType = {
  id?: string,
  doc?: Object,
  key?: string
};

export default class Tasks extends Component {
  state: {
    selectedTask: string
  };

  props: {
    updateTask: () => void,
    updateTasks: () => void,
    fetchTasks: () => void,
    syncGCalendar: () => void,
    tasksList: {
      tasks: Array<TaskType>
    }
  }

  constructor() {
    super();
    this.state = {
      selectedTask: ''
    };
  }

  componentWillMount() {
    this.syncGCal();
    this.props.fetchTasks('today');
  }

  async syncGCal() {
    this.props.syncGCalendar(true);
    setTimeout(() => {
      this.props.fetchTasks('today');
    }, 3000);
  }

  reFetchTasks() {
    this.props.fetchTasks('today');
  }

  handleTaskClick(task: TaskType) {
    const win = remote.getCurrentWindow();
    if (this.state.selectedTask === task.id) {
      this.setState({ selectedTask: '' });
      win.setMovable(true);
    } else if (!task.doc.source) {
      this.setState({ selectedTask: task.id });
      win.setMovable(false);
    }
  }

  moveTask(task: TaskType, newPosition: number) {
    const newTask = task;
    const msInADay = 24 * 60 * 60 * 1000;
    const totalHeight = 120 * 24;
    const milliseconds = newPosition * (msInADay / totalHeight);
    const beginAt = moment(newTask.beginAt);
    const beginAtMs = (beginAt.hours() * 60 * 60 * 1000) +
                      (beginAt.minutes() * 60 * 1000) +
                      (beginAt.seconds() * 1000) +
                      beginAt.milliseconds();

    const deltaMs = milliseconds - beginAtMs;

    newTask.beginAt = moment(newTask.beginAt).add(deltaMs, 'milliseconds').toISOString();
    newTask.endAt = moment(newTask.endAt).add(deltaMs, 'milliseconds').toISOString();
    this.props.updateTask(newTask);
    this.props.fetchTasks('today');
  }

  resizeTask(task: TaskType, dir: string, delta: number) {
    const newTask = task;
    const msInADay = 24 * 60 * 60 * 1000;
    const totalHeight = 120 * 24;
    const diffMs = delta * (msInADay / totalHeight);

    if (dir === 'top') {
      const beginAt = moment(task.beginAt);
      beginAt.subtract(diffMs, 'milliseconds');
      newTask.beginAt = beginAt.toISOString();
    }

    if (dir === 'bottom') {
      const endAt = moment(task.endAt);
      endAt.add(diffMs, 'milliseconds');
      newTask.endAt = endAt.toISOString();
    }

    this.props.updateTask(newTask);
    this.props.fetchTasks('today');
  }

  render() {
    const {
      tasks
    } = this.props.tasksList;
    this.props.updateTasks(this.props.tasksList.tasks);
    return (
      <div className={styles.tasks}>
        {tasks.map(task => (
          <div onClick={() => this.handleTaskClick(task)} key={task.id} className={styles.task}>
            <Task
              task={task.doc} reFetchTasks={this.reFetchTasks.bind(this)}
              moveTask={this.moveTask.bind(this)}
              resizeTask={this.resizeTask.bind(this)}
              selected={this.state.selectedTask === task.id}
            />
          </div>
        ))}
      </div>
    );
  }
}
