/* eslint class-methods-use-this: ["error", { "exceptMethods": ["renderError"] }] */
import { remote } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, Field, SubmissionError } from 'redux-form';
import { Link } from 'react-router';
import { push } from 'react-router-redux';

import styles from './NewTask.css';
import renderField from './renderField';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import AppSelector from './AppSelector';
import { createTask, createTaskSuccess, createTaskFailure } from '../actions/tasks';

// Client side validation
const validate = values => {
  const errors = {};

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Enter a task name';
  }
  if (!values.beginAtDate) {
    errors.beginAtDate = 'Enter a begin date';
  }
  if (!values.endAtDate) {
    errors.endAtDate = 'Enter a end date';
  }

  return errors;
};

// For any field errors upon submission (i.e. not instant check)
const validateAndCreateTask = (values, dispatch) => dispatch(createTask(values))
  .then(result => {
    // Note: Error's "data" is in result.payload.response.data (inside "response")
    // success's "data" is in result.payload.data
    if (result.payload && !result.payload.ok) {
      dispatch(createTaskFailure(result.payload));
      throw new SubmissionError(result.payload);
    }
    // let other components know that everything is fine by updating the redux` state
    dispatch(createTaskSuccess(result.payload));
    dispatch(push('/'));
  });
;

let NewTaskForm = class NewTask extends Component {
  props: {
    handleSubmit: () => void,
    submitting: boolean,
    newTask: object
  };

  constructor() {
    super();
    const win = remote.getCurrentWindow();
    win.setSize(300, 450, true);
    this.state = {};
  }

  renderError(newTask) {
    if (newTask && newTask.error && newTask.error.message) {
      return (
        <div className="alert alert-danger">
          { newTask ? newTask.error.message : '' }
        </div>
      );
    }
    return <span />;
  }

  render() {
    const { handleSubmit, pristine, submitting, newTask, actionValue } = this.props;

    return (
      <div className={styles.container}>
        {this.renderError(newTask)}
        <Link to="/" className={styles.backButton}>
          <i className="fa fa-chevron-left" /> Back
        </Link>
        <form onSubmit={handleSubmit(validateAndCreateTask)}>
          <Field
            name="name"
            type="text"
            component={renderField}
            label="Task name*" required
          />
          <div className={styles.inlineField}>
            <Field
              name="beginAtDate"
              type="date"
              component={DatePicker}
              label="Begin*" required
            />
            <Field
              name="beginAtTime"
              type="time"
              component={TimePicker} required
            />
          </div>
          <div className={styles.inlineField}>
            <Field
              name="endAtDate"
              type="date"
              component={DatePicker}
              label="End*" required
            />
            <Field
              name="endAtTime"
              type="time"
              component={TimePicker} required
            />
          </div>
          <div>
            <label>Action</label>
            <div>
              <Field name="action" component="select">
                <option>None</option>
                <option value="link">Website link</option>
                <option value="app">Desktop App</option>
              </Field>
            </div>
          </div>
          { actionValue === 'link' && <Field
            name="actionLink"
            type="text"
            component={renderField}
            label="Link"
          /> }
          { actionValue === 'app' && <Field
            name="actionApp"
            type="text"
            component={AppSelector}
            label="App"
          /> }
          <button
            type="submit"
            className="button button--primary button--sm button--block"
            disabled={pristine || submitting}
          >
            Add
          </button>
        </form>
      </div>
    );
  }
};

NewTaskForm = reduxForm({
  form: 'NewTask', // a unique identifier for this form
  validate // <--- validation function given to redux-form
  // asyncValidate
})(NewTaskForm);

const selector = formValueSelector('NewTask');

export default connect(
  state => {
    const actionValue = selector(state, 'action');

    return { actionValue };
  }
)(NewTaskForm);
