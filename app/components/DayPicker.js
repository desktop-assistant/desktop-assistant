// @flow
import React, { Component } from 'react';
import Select from 'react-select';

const options = [
  { value: 'Sunday', label: 'Sun' },
  { value: 'Monday', label: 'Mon' },
  { value: 'Tuesday', label: 'Tue' },
  { value: 'Wednesday', label: 'Wed' },
  { value: 'Thursday', label: 'Thu' },
  { value: 'Friday', label: 'Fri' },
  { value: 'Saturday', label: 'Sat' }
];
const defaultRepeatDays = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday';

export default class DayPicker extends Component {
  state: {
    touched?: boolean
  }

  props: {
    input: Object,
    meta: Object,
    label: string
  }

  constructor() {
    super();

    this.state = {
      touched: false
    };
  }
  render() {
    const {
      input: { label, name, onChange, value },
      meta: { touched, error, warning }
    } = this.props;
    return (
      <div>
        <label className="control-label" htmlFor={name}>{this.props.label}</label>
        <Select
          name={name}
          value={value || this.state.touched ? value : defaultRepeatDays}
          multi
          options={options}
          onChange={days => { onChange(days); this.setState({ touched: true }); }}
        />
        <div className="help-block">
          {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
      </div>
    );
  }
}
