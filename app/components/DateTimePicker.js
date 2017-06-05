// @flow
import React, { Component } from 'react';
import moment from 'moment';
import DayPicker from 'react-day-picker';

import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

import styles from './DateTimePicker.scss';

export default class DateTimePicker extends Component {
  props: {
    input: Object,
    meta: Object,
    label: string
  }

  state: {
    dateInput: {
      onChange: void
    },
    timeInput: {
      onChange: void
    }
  };

  constructor() {
    super();
    this.state = {
      dateInput: {
        onChange: this.onDateChange.bind(this)
      },
      timeInput: {
        onChange: this.onTimeChange.bind(this)
      }
    };
  }

  onDateChange(date: string) {
    const value = this.state.value || moment().minutes(0).seconds(0).milliseconds(0);
    const mDate = moment(date);
    value.month(mDate.month()).day(mDate.day()).year(mDate.year());
    this.setState({ value });
    this.props.input.value = value.format();
    this.props.input.onChange(value.format());
  }

  onTimeChange(time) {
    const value = this.state.value || moment();
    const mDate = moment(time);
    value.hours(mDate.hours()).minutes(mDate.minutes());
    this.setState({ value });
    this.props.input.value = value.format();
    this.props.input.onChange(value.format());
  }

  render() {
    const { input: { label, onChange }, meta: { touched, error, invalid, warning } } = this.props;
    return (
      <div className={styles.container}>
        <DatePicker
          {...this.props.input}
          label={this.props.label}
          input={this.state.dateInput}
          meta={this.props.meta}
        />
        <div className={styles.at}>at</div>
        <TimePicker
          {...this.props.input}
          input={this.state.timeInput}
          meta={this.props.meta}
        />
      </div>
    );
  }
}
