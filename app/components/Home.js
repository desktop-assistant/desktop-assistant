// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import Timing from '../components/Timing';
import Actions from '../components/Actions';


export default class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Timing />
        <div className={styles.leftTimeIndication}/>
        <div className={styles.rightTimeIndication}/>
        <Actions/>
      </div>
    );
  }
}
