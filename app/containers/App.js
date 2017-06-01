// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import AutoUpdate from '../components/AutoUpdate';

import styles from './App.css';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div className={styles.app}>
        <AutoUpdate />
        {this.props.children}
      </div>
    );
  }
}
