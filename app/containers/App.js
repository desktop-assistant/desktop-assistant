// @flow
import React, { Component } from 'react';
import type { Children } from 'react';

import styles from './App.css';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div className={styles.app}>
        {this.props.children}
      </div>
    );
  }
}
