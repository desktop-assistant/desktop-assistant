// @flow
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
import DayPicker from './DayPicker';

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
  if (!values.beginAtTime) {
    errors.beginAtTime = 'Enter a begin time';
  }
  if (!values.endAtTime) {
    errors.endAtTime = 'Enter a end time';
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
    return true;
  });

type TaskType = {};

let NewTaskForm = class NewTask extends Component {
  props: {
    handleSubmit: () => void,
    pristine: boolean,
    submitting: boolean,
    newTask: TaskType,
    actionValue: string,
    freqValue: string
  };

  static renderError(newTask?: TaskType) {
    if (newTask && newTask.error && newTask.error.message) {
      return (
        <div className="alert alert-danger">
          { newTask ? newTask.error.message : '' }
        </div>
      );
    }
    return <span />;
  }

  constructor() {
    super();
    const win = remote.getCurrentWindow();
    win.setSize(350, 700);
    this.state = {
      repeat: false
    };
  }

  state: {
    repeat: boolean
  };

  render() {
    const { handleSubmit, pristine, submitting, newTask, actionValue, freqValue } = this.props;

    return (
      <div className={styles.container}>
        {NewTask.renderError(newTask)}
        <Link to="/" className={styles.backButton}>
          <i className="fa fa-chevron-left" />
        </Link>
        <h1>New Task</h1>
        <form className={styles.form} onSubmit={handleSubmit(validateAndCreateTask)}>
          <Field
            name="name"
            type="text"
            component={renderField}
            label="NAME" required
          />
          <div className={styles.inlineField}>
            <div className={styles.beginIcon} />
            <Field
              name="beginAtDate"
              type="date"
              component={DatePicker}
              label="BEGIN" required
            />
            <div className={styles.at}>at</div>
            <Field
              name="beginAtTime"
              type="time"
              component={TimePicker} required
            />
          </div>
          <div className={styles.inlineField}>
            <div className={styles.endIcon} />
            <Field
              name="endAtDate"
              type="date"
              component={DatePicker}
              label="END" required
            />
            <div className={styles.at}>at</div>
            <Field
              name="endAtTime"
              type="time"
              component={TimePicker} required
            />
          </div>
          <div>
            <label className="control-label" htmlFor="action">ACTION</label>
            <div className="custom-select form-control">
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
            label="LINK"
          /> }
          { actionValue === 'app' && <Field
            name="actionApp"
            type="text"
            component={AppSelector}
            label="APP"
          /> }
          {this.state.repeat ?
            <div className={styles.noRepeat}>
              <a onClick={() => (this.setState({ repeat: !this.state.repeat }))}>Stop repeat ?</a>
            </div>
            :
            <div className={styles.repeat}>
              <a onClick={() => (this.setState({ repeat: !this.state.repeat }))}>Repeat ?</a>
            </div>
          }
          { this.state.repeat &&
            <div>
              <label className="control-label" htmlFor="action">FREQUENCY</label>
              <div className="custom-select form-control">
                <Field name="freq" component="select">
                  <option>None</option>
                  <option value="daily">Daily</option>
                </Field>
              </div>
            </div>
          }
          { this.state.repeat && freqValue === 'daily' && <div>
            <Field
              name="repeatOn"
              component={DayPicker}
              label="REPEAT ON"
            />
          </div> }
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
    const freqValue = selector(state, 'freq');

    return { actionValue, freqValue };
  }
)(NewTaskForm);
