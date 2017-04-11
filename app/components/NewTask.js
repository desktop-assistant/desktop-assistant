/* eslint class-methods-use-this: ["error", { "exceptMethods": ["renderError"] }] */
import React, { Component } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Link } from 'react-router';
import styles from './NewTask.css';
import renderField from './renderField';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import { createTask, createTaskSuccess, createTaskFailure } from '../actions/tasks';

// Client side validation
function validate() {
  const errors = {};

  // if (!values.title || values.title.trim() === '') {
  //   errors.title = 'Enter a Title';
  // }
  // if (!values.categories || values.categories.trim() === '') {
  //   errors.categories = 'Enter categories';
  // }
  // if (!values.content || values.content.trim() === '') {
  //   errors.content = 'Enter some content';
  // }

  return errors;
}

// For any field errors upon submission (i.e. not instant check)
const validateAndCreateTask = (values, dispatch) => dispatch(createTask(values))
    .then(result => {
      console.log('validateAndCreateTask', result);
      // Note: Error's "data" is in result.payload.response.data (inside "response")
      // success's "data" is in result.payload.data
      if (result.payload && !result.payload.ok) {
        dispatch(createTaskFailure(result.payload));
        throw new SubmissionError(result.payload);
      }
      //let other components know that everything is fine by updating the redux` state
      dispatch(createTaskSuccess(result.payload));
    });
;

class NewTask extends Component {
  props: {
    handleSubmit: () => void,
    submitting: boolean,
    newTask: object
  };

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
    const { handleSubmit, submitting, newTask } = this.props;

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
              label="Task name*" required
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
              label="Task name*" required
            />
            <Field
              name="endAtTime"
              type="time"
              component={TimePicker} required
            />
          </div>
          <button
            type="submit"
            className="button button--primary button--sm"
            disabled={submitting}
          >
            Add
          </button>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'NewTask', // a unique identifier for this form
  validate // <--- validation function given to redux-form
  // asyncValidate
})(NewTask);
