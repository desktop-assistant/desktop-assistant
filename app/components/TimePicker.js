import React, { Component } from 'react';
import classNames from 'classnames/bind';
import ClockPicker from './ClockPicker';

import styles from './TimePicker.css';

const cx = classNames.bind(styles);

export default class TimePicker extends Component {
  constructor() {
    super()
    this.state = { modalVisible: false }
  }

  state: {
    modalVisible: boolean
  };

  onDayChange(hours, minutes) {
    this.props.input.onChange(`${hours}:${minutes}`)
    this.setState({ modalVisible: false });
  }

  handleClick() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const { input: { value, onChange } } = this.props
    const now  = new Date();
    const modalClassName = cx({
      modal: true,
      visible: this.state.modalVisible
    });
    return (
      <div className={styles.container}>
        <input
          {...this.props.input}
          placeholder="Click to select a time"
          onClick={this.handleClick.bind(this)} />
        <div className={modalClassName}>
          <div className={styles.close} onClick={this.closeModal.bind(this)} />
          <ClockPicker
            size   = { 300 }
            radius = { 125 }
            hours   = { now.getHours() }
            minutes = { now.getMinutes() }
            militaryTime = { true }
            onChange={ ({ hours, minutes }) => this.onDayChange(hours, minutes) }/>
        </div>
      </div>
    );
  }
}
