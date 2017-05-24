// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import Rnd from 'react-rnd';
import classNames from 'classnames/bind';

import styles from './Task.scss';
import gCalendarLogo from '../assets/img/logo-google-calendar-32px.png';

const cx = classNames.bind(styles);

type SizeType = {
  width?: number,
  height?: number,
  top?: number
};

type DeltaType = {
  position: SizeType
};

type TaskType = {
  _id: string,
  beginAtDate: string,
  beginAtTime: string,
  endAtDate: string,
  endAtTime: string,
  name: string,
  source?: string
};

function openLink(link: string) {
  shell.openExternal(link);
}

export default class Task extends Component {
  state: {
    dragging: boolean,
    rnd: Object
  }

  props: {
    moveTask: () => void,
    resizeTask: () => void,
    reFetchTasks: () => void,
    onDeleteClick: () => void,
    selected: boolean,
    task: TaskType
  }

  static timeStringToFloat(time) {
    const hoursMinutes = time.split(/[.:h]/);
    const hours = parseInt(hoursMinutes[0], 10);
    const minutes = parseInt(hoursMinutes[1], 10);
    const floatValue = hours + (minutes / 60);
    return floatValue;
  }

  static getTaskHeight(beginTime, endTime) {
    if (!beginTime || !beginTime.length || !endTime || !endTime.length) {
      return 0;
    }
    const duration = Task.timeStringToFloat(endTime) - Task.timeStringToFloat(beginTime);
    return duration * 120;
  }

  constructor() {
    super();
    this.state = {
      dragging: false,
      selected: false,
      rnd: {}
    };
  }

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

  onDragStop(e: Event, ui: DeltaType) {
    this.setState({ dragging: false });
    this.rnd.updateZIndex(1);
    this.props.moveTask(this.props.task, ui.position.top);
  }

  onResizeStop(dir: string, size: SizeType, rect: SizeType, delta: SizeType) {
    this.props.resizeTask(this.props.task, dir, delta.height);
  }

  handleTaskClick() {
    this.setState({ selected: !this.state.selected });
  }

  rnd = {}

  render() {
    const {
      task, selected
    } = this.props;
    const TaskStyle = cx({
      task: true,
      selectable: task.source !== 'google calendar',
      selected: this.props.selected
    });
    return (
      <Rnd
        zIndex={0}
        ref={c => { this.rnd = c; }}
        className={TaskStyle}
        isResizable={selected ? { top: true, bottom: true } : {}}
        onDragStart={this.onDragStart.bind(this)}
        onDragStop={this.onDragStop.bind(this)}
        onResizeStop={this.onResizeStop.bind(this)}
        moveAxis={selected ? 'y' : 'none'}
        initial={{
          x: 0,
          y: task.beginAtTime ? Task.timeStringToFloat(task.beginAtTime) * 120 : 0,
          height: Task.getTaskHeight(task.beginAtTime, task.endAtTime)
        }}
        style={{
          opacity: this.state.dragging ? 0.5 : 1
        }}
      >
        { task.source !== 'google calendar' &&
          <button onClick={this.onDeleteClick.bind(this)} className={styles.deleteTask}>
            <i className="fa fa-trash" aria-hidden="true" />
          </button>
        }
        <div className={styles.taskTitle}>
          <h3>{ task.name }</h3>
          { task.source === 'google calendar' &&
            <a href="" onClick={() => (openLink(task.sourceLink))}>
              <img src={gCalendarLogo} className={styles.gCalendarLogo} alt="gcalendar-logo" />
            </a>
          }
        </div>
        <div className={styles.taskContent}>
          <div className={styles.taskInfos}>
            { task.location &&
              <div classNmae={styles.taskLocation}>
                <i className="fa fa-location-arrow" aria-hidden="true"></i> { task.location }
              </div>
            }
          </div>
          <div className={styles.taskDuration}>
            <div className={styles.durationBegin}>{ task.beginAtTime }</div>
            <div className={styles.line} />
            <div className={styles.durationEnd}>{ task.endAtTime }</div>
          </div>
        </div>
      </Rnd>
    );
  }
}
