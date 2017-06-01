// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import classNames from 'classnames/bind';
import styles from './AutoUpdate.scss';

const cx = classNames.bind(styles);

export default class AutoUpdate extends Component {
  state: {
    progressStatus: string,
    visible: boolean,
    updateInProgress: false,
    error: boolean
  };

  constructor() {
    super();
    this.state = {
      progressStatus: '',
      visible: false,
      updateInProgress: false,
      error: false
    };
  }

  componentWillMount() {
    ipcRenderer.on('message', (event, status, text) => {
      this.setState({ progressStatus: text });
      this.setState({ updateInProgress: status && status === 'progress' });

      if (status !== 'close') {
        this.setState({ visible: true });
      }

      if (status && status === 'error') {
        this.setState({ error: true });
        setTimeout(this.closeAutoUpdate.bind(this), 5000);
      }
    });
    ipcRenderer.send('ready');
  }

  closeAutoUpdate() {
    this.setState({ visible: false });
  }

  render() {
    const AutoUpdateStyle = cx({
      container: true,
      visible: this.state.visible
    });
    return (
      <div className={AutoUpdateStyle}>
        <h1>Update</h1>
        <div className={styles.progressStatus}>
          {this.state.progressStatus}
        </div>
        { this.state.updateInProgress &&
          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              // style={{ width: '40%' }}
            />
          </div>
        }
        { this.state.error &&
          <div className={styles.error}>
            An error occured during update this screen will auto-close in 5sec
          </div>
        }
      </div>
    );
  }
}
