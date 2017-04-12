/* eslint-disable class-methods-use-this */
// @flow
import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import classNames from 'classnames/bind';

import styles from './Task.css';

const cx = classNames.bind(styles);

const cardSource = {
  canDrag(props) {
    return props.selected;
  },
  beginDrag(props) {
    return {
      text: props.text
    };
  },
  endDrag(props, monitor) {
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      const newPosition = monitor.getDifferenceFromInitialOffset();
      props.moveTask(props.task, newPosition);
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function timeStringToFloat(time) {
  const hoursMinutes = time.split(/[.:h]/);
  const hours = parseInt(hoursMinutes[0], 10);
  const minutes = parseInt(hoursMinutes[1], 10);
  const floatValue = hours + (minutes / 60);
  return floatValue;
}

function getTaskHeight(beginTime, endTime) {
  if (!beginTime || !beginTime.length || !endTime || !endTime.length) {
    return 0;
  }
  const duration = timeStringToFloat(endTime) - timeStringToFloat(beginTime);
  return duration * 200;
}

/* eslint-disable react/prop-types */
class Task extends Component {
  constructor() {
    super();
    this.state = {
      selected: false,
      deleted: false
    };
  }

  state: {
    deleted: boolean
  };

  onDeleteClick() {
    this.props.onDeleteClick(this.props.task);
    setTimeout(() => {
      this.props.reFetchTasks();
    }, 500);
  }

  handleTaskClick() {
    this.setState({ selected: !this.state.selected });
  }

  render() {
    const taskClassName = cx({
      task: true,
      selected: this.props.selected
    });
    const {
      task, isDragging, connectDragSource
    } = this.props;
    return connectDragSource(
      <div
        className={taskClassName}
        style={{
          opacity: isDragging ? 0.5 : 1,
          top: `${task.beginAtTime ? timeStringToFloat(task.beginAtTime) * 200 : 0}px`,
          height: `${getTaskHeight(task.beginAtTime, task.endAtTime)}px`
        }}
      >
        <a onClick={this.onDeleteClick.bind(this)} className={styles.deleteTask}>
          <i className="fa fa-trash" aria-hidden="true"></i>
        </a>
        <h3>{ task.name }</h3>
        <div>{ task.beginAtTime } - { task.endAtTime }</div>
      </div>
    );
  }
}

export default DragSource('TASK', cardSource, collect)(Task);
