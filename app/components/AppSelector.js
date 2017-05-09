// @flow
import React, { Component } from 'react';
import electron from 'electron';

import styles from './AppSelector.css';

export default class AppSelector extends Component {
  handleClick() {
    const { dialog } = electron.remote;
    dialog.showOpenDialog({
      defaultPath: '~/Applications',
      properties: ['openFile'],
      filters: [
        { name: 'Applications', extensions: ['app'] }
      ]
    }, fileName => {
      this.props.input.onChange(fileName[0]);
    });
  }

  render() {
    const { input: { name, label, value, onChange }, meta: { touched, error, invalid, warning } } = this.props;
    return (
      <div className={styles.container}>
        <label htmlFor={this.props.input.name} className="control-label">{this.props.label}</label>
        <div>
          <input
            {...this.props.input}
            className="form-control"
            placeholder="Click to select an app"
            onClick={this.handleClick.bind(this)}
          />
          <div className="help-block">
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
          </div>
        </div>
      </div>
    );
  }
}
