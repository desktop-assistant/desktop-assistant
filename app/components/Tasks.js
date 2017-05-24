// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { remote } from 'electron';

import Task from '../containers/TaskContainer';
import styles from './Tasks.css';

type TaskType = {
  _id: string,
  beginAtDate: string,
  beginAtTime: string,
  endAtDate: string,
  endAtTime: string,
  repeatOn?: string
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

  static getTaskWithFreq(task: TaskType) {
    const newTask = task;
    if (task.freq === 'weekly') {
      const now = moment();
      const today = now.format('dddd');

      const repeatOn = newTask.repeatOn || 'Sunday,Tuesday,Monday,Wednesday,Thursday,Friday,Saturday';
      if (repeatOn.indexOf(today) > -1) {
        newTask.beginAtDate = now.format('MM-DD-YYYY');
      }
    }

    if (task.freq === 'daily') {
      const now = moment();
      newTask.beginAtDate = now.format('MM-DD-YYYY');
    }

    return newTask;
  }

  constructor() {
    super();
    this.state = {
      selectedTask: ''
    };
  }

  componentWillMount() {
    this.syncGCal();
    this.props.fetchTasks();
  }

  async syncGCal() {
    this.props.syncGCalendar(true);
    setTimeout(() => {
      this.props.fetchTasks();
    }, 3000);
  }

  reFetchTasks() {
    this.props.fetchTasks();
  }

  handleTaskClick(task: TaskType) {
    const win = remote.getCurrentWindow();
    if (this.state.selectedTask === task._id) {
      this.setState({ selectedTask: '' });
      win.setMovable(true);
    } else if (!task.source) {
      this.setState({ selectedTask: task._id });
      win.setMovable(false);
    }
  }

  moveTask(task: TaskType, newPosition: number) {
    const newTask = task;
    const beginMinutes = newPosition * 0.5;

    const beginDate = moment(`${task.beginAtDate}-${task.beginAtTime}`, 'MM-DD-YYYY-HH:mm');
    const endDate = moment(`${task.endAtDate}-${task.endAtTime}`, 'MM-DD-YYYY-HH:mm');
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

  resizeTask(task: TaskType, dir: string, delta: number) {
    const newTask = task;
    const diffTime = delta * 0.5;
    const beginDate = moment(`${task.beginAtDate}-${task.beginAtTime}`, 'MM-DD-YYYY-HH:mm');
    const endDate = moment(`${task.endAtDate}-${task.endAtTime}`, 'MM-DD-YYYY-HH:mm');

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

  render() {
    const {
      tasks
    } = this.props.tasksList;
    this.props.updateTasks(this.props.tasksList.tasks);
    return (
      <div className={styles.tasks}>
        {tasks.map(t => {
          let task = t;
          if (task.freq) {
            task = Tasks.getTaskWithFreq(task);
          }
          const beginDate = moment(`${task.beginAtDate}-${task.beginAtTime}`, 'MM-DD-YYYY-HH:mm');
          const now = moment();
          if (task && beginDate.isSame(now, 'day')) {
            return (
              <div onClick={() => this.handleTaskClick(task)} key={task._id} className={styles.task}>
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
