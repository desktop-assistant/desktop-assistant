import React, { Component } from 'react';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import classNames from 'classnames/bind';

import styles from './DatePicker.css';

const cx = classNames.bind(styles);

export default class DatePicker extends Component {
  constructor() {
    super()
    this.state = { modalVisible: false }
  }

  state: {
    modalVisible: boolean
  };

  onDayChange() {
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
    const modalClassName = cx({
      modal: true,
      visible: this.state.modalVisible
    });
    return (
      <div className={styles.container}>
        <input
          {...this.props.input}
          placeholder="Click to select a date"
          onClick={this.handleClick.bind(this)} />
        <div className={modalClassName}>
          <div className={styles.close} onClick={this.closeModal.bind(this)} />
          <DayPicker
            selectedDays={ this.state.selectedDay }
            onDayClick={day => { this.state.selectedDay = day; this.onDayChange(); onChange(moment(day).format('MM-DD-YYYY')) }}
          />
        </div>
      </div>
    );
  }
}
