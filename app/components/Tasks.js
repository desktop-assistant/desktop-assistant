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
    currentDay: string,
    updateTask: () => void,
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
    this.props.fetchTasks(this.props.currentDay);
  }

  async syncGCal() {
    this.props.syncGCalendar({ check: true });
    setTimeout(() => {
      this.props.fetchTasks(this.props.currentDay);
    }, 3000);
  }

  reFetchTasks() {
    this.props.fetchTasks(this.props.currentDay);
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
    this.props.fetchTasks(this.props.currentDay);
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
    this.props.fetchTasks(this.props.currentDay);
  }

  render() {
    const {
      tasks
    } = this.props.tasksList;
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
