// @flow
import React, { Component } from 'react';

import styles from './App.css';

export default class App extends Component {
  props: {
    children: HTMLElement
  };

  render() {
    return (
      <div className={styles.app}>
        {this.props.children}
      </div>
    );
  }
}
