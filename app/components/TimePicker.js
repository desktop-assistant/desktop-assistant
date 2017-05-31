// @flow
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import ClockPicker from './ClockPicker';

import styles from './TimePicker.css';

const cx = classNames.bind(styles);

function twoDigits(n) {
  return n > 9 ? `${n}` : `0${n}`;
}

export default class TimePicker extends Component {
  state: {
    modalVisible: boolean
  }

  props: {
    input: Object,
    meta: Object
  }

  constructor() {
    super();
    this.state = { modalVisible: false };
  }

  onDayChange(hours: number, minutes: number) {
    this.props.input.onChange(`${twoDigits(hours)}:${twoDigits(minutes)}`);
    this.setState({ modalVisible: false });
  }

  handleClick() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const { input, meta: { touched, error, warning } } = this.props;
    const now = new Date();
    const modalClassName = cx({
      modal: true,
      visible: this.state.modalVisible
    });
    return (
      <div className={styles.container}>
        <input
          {...this.props.input}
          className="form-control"
          placeholder="Select a time"
          onClick={this.handleClick.bind(this)}
        />
        <div className="help-block">
          {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
        <div className={modalClassName}>
          <button className={styles.close} onClick={this.closeModal.bind(this)} />
          <ClockPicker
            size={300}
            radius={125}
            hours={now.getHours()}
            minutes={now.getMinutes()}
            militaryTime="true"
            onChange={({ hours, minutes }) => this.onDayChange(hours, minutes)}
          />
        </div>
      </div>
    );
  }
}
