/* eslint-disable class-methods-use-this */
// @flow
import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import moment from 'moment';

import Task from '../containers/TaskContainer';
import styles from './Tasks.css';

/* eslint-disable react/prop-types */
class Tasks extends Component {
  props: {
    updateTask: () => void,
    updateTasks: () => void,
    fetchTasks: () => void,
    tasksList: {
      tasks: Array<Object>
      // loading: boolean
    }
  }

  constructor() {
    super();
    this.state = {
      selectedTask: ''
    };
  }

  state: {
    selected: string
  };

  componentWillMount() {
    this.props.fetchTasks();
  }

  moveTask(task, newPosition) {
    const newTask = task;
    const timeToAdd = newPosition.y * 0.3; // time to add in min

    const beginDate = moment(`${task.beginAtDate}-${task.beginAtTime}`, 'MM-DD-YYYY-H:m');
    const endDate = moment(`${task.endAtDate}-${task.endAtTime}`, 'MM-DD-YYYY-H:m');

    beginDate.add(timeToAdd, 'minutes');
    endDate.add(timeToAdd, 'minutes');

    newTask.beginAtDate = beginDate.format('MM-DD-YYYY');
    newTask.beginAtTime = beginDate.format('H:m');

    newTask.endAtDate = endDate.format('MM-DD-YYYY');
    newTask.endAtTime = endDate.format('H:m');

    this.props.updateTask(newTask);
    this.setState({ selectedTask: '' });
    this.props.fetchTasks();
  }

  reFetchTasks() {
    this.props.fetchTasks();
  }

  handleTaskClick(taskId) {
    console.log('taskId', this.state.selectedTask, taskId);
    if (this.state.selectedTask === taskId) {
      this.setState({ selectedTask: '' });
    } else {
      this.setState({ selectedTask: taskId });
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
            return (
              <div onClick={() => this.handleTaskClick(task._id)}>
                <Task
                  key={task._id}
                  task={task} reFetchTasks={this.reFetchTasks.bind(this)}
                  moveTask={this.moveTask.bind(this)}
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

 export default DragDropContext(HTML5Backend)(Tasks);
