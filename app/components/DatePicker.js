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
    const { input: { name, label, value, onChange }, meta: { touched, error, invalid, warning } } = this.props
    const modalClassName = cx({
      modal: true,
      visible: this.state.modalVisible
    });
    return (
      <div className={styles.container}>
        <div className={`${touched && invalid ? 'has-error' : ''}`}>
          <label htmlFor={this.props.input.name} className="control-label">{this.props.label}</label>
          <div>
            <input
              {...this.props.input}
              className="form-control"
              placeholder="Select a date"
              onClick={this.handleClick.bind(this)} />
            <div className="help-block">
              {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
            </div>
            <div className={modalClassName}>
              <div className={styles.close} onClick={this.closeModal.bind(this)} />
              <DayPicker
                selectedDays={ this.state.selectedDay }
                onDayClick={day => { this.state.selectedDay = day; this.onDayChange(); onChange(moment(day).format('MM-DD-YYYY')) }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
