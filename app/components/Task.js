/* eslint-disable class-methods-use-this */
// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Rnd from 'react-rnd';
// import { DragSource } from 'react-dnd';
// import Resizable from 'react-resizable-box';
import classNames from 'classnames/bind';

import styles from './Task.css';

const cx = classNames.bind(styles);

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
export default class Task extends Component {
  constructor() {
    super();
    this.state = {
      dragging: false,
      selected: false,
      rnd: {}
    };
  }

  state: {
    dragging: boolean,
    deleted: boolean,
    rnd: Object
  };

  onDeleteClick() {
    this.props.onDeleteClick(this.props.task);
    setTimeout(() => {
      this.props.reFetchTasks();
    }, 500);
  }

  onDragStart() {
    this.setState({ dragging: true });
    this.rnd.updateZIndex(2);
  }

  onDragStop(event, ui) {
    this.setState({ dragging: false });
    this.rnd.updateZIndex(1);
    this.props.moveTask(this.props.task, ui.position.top);
  }

  onResizeStop(dir, size, rect, delta) {
    this.props.resizeTask(this.props.task, dir, delta.height);
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
      task, selected
    } = this.props;
    return (
      <Rnd
        zIndex={0}
        ref={c => { this.rnd = c; }}
        className={taskClassName}
        isResizable={selected ? { top: true, bottom: true } : {}}
        onDragStart={this.onDragStart.bind(this)}
        onDragStop={this.onDragStop.bind(this)}
        onResizeStop={this.onResizeStop.bind(this)}
        moveAxis={selected ? 'y': 'none'}
        initial={{
          x: 0,
          y: task.beginAtTime ? timeStringToFloat(task.beginAtTime) * 200 : 0,
          height: getTaskHeight(task.beginAtTime, task.endAtTime)
        }}
        style={{
          opacity: this.state.dragging ? 0.5 : 1
        }}
      >
        <a onClick={this.onDeleteClick.bind(this)} className={styles.deleteTask}>
          <i className="fa fa-trash" aria-hidden="true"></i>
        </a>
        <h3>{ task.name }</h3>
        <div>{ task.beginAtTime } - { task.endAtTime }</div>
      </Rnd>
    );
  }
}
