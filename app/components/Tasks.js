// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Tasks.css';


export default class Tasks extends Component {
  componentWillMount() {
    this.props.fetchTasks();
  }

  render() {
    const { tasks, loading, error } = this.props.tasksList;
    console.log(tasks)
    return (
      <div className={ styles.tasks }>
        <pre>{ tasks }</pre>
      </div>
    );
  }
}
