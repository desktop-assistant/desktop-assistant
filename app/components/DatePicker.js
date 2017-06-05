// @flow
import React, { Component } from 'react';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import classNames from 'classnames/bind';

import styles from './DatePicker.css';

const cx = classNames.bind(styles);

export default class DatePicker extends Component {
  state: {
    modalVisible: boolean,
    selectedDay: Date
  };

  props: {
    input: Object,
    meta: Object,
    label: string
  }

  constructor() {
    super();
    this.state = { modalVisible: false, selectedDay: new Date() };
  }

  onDayChange(day) {
    const value = moment(day);
    this.setState({
      modalVisible: false,
      selectedDay: day,
      displayValue: value.format('MM-DD-YYYY')
    });
    this.props.input.onChange(value.format());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.value) {
      this.setState({
        displayValue: moment(nextProps.value).format('MM-DD-YYYY')
      });
    }
  }

  handleClick() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const { input: { label, onChange }, meta: { touched, error, invalid, warning } } = this.props;
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
              value={this.state.displayValue}
              className="form-control"
              placeholder="Select a date"
              onClick={this.handleClick.bind(this)}
            />
            <div className="help-block">
              {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
            </div>
            <div className={modalClassName}>
              <button className={styles.close} onClick={this.closeModal.bind(this)} />
              <DayPicker
                selectedDays={this.state.selectedDay}
                onDayClick={day => { this.onDayChange(day); }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
