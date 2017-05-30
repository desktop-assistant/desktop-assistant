// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import Timing from '../containers/TimingContainer';
import Actions from '../components/Actions';


export default class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.background} />
        <Timing />
        <div className={styles.leftTimeIndication} />
        <div className={styles.rightTimeIndication} />
        <Actions />
      </div>
    );
  }
}
