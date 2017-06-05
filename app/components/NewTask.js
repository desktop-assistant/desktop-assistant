// @flow
import { remote } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, Field, SubmissionError } from 'redux-form';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import _ from 'lodash';
import moment from 'moment';

import styles from './NewTask.css';
import renderField from './renderField';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import DateTimePicker from './DateTimePicker';
import AppSelector from './AppSelector';
import DayPicker from './DayPicker';

import { createTask, createTaskSuccess, createTaskFailure } from '../actions/tasks';
import { loadTask } from '../reducers/taskForm';

// Client side validation
const validate = values => {
  const errors = {};

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Enter a task name';
  }
  if (!values.beginAt) {
    errors.beginAt = 'Enter a begin date';
  }
  if (!values.endAt) {
    errors.endAt = 'Enter a end date';
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
    getTask: () => void,
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
      mode: 'add',
      repeat: false
    };
  }

  componentWillMount() {
    const idParam = _.get(this.props, 'match.params.id');
    if (idParam) {
      this.setState({ mode: 'edit' });
      this.props.getTask(idParam);
    }
  }

  state: {
    mode: string,
    repeat: boolean
  };

  render() {
    const { handleSubmit, pristine, submitting, newTask, actionValue, freqValue } = this.props;

    return (
      <div>
        <div className={styles.container}>
          {NewTask.renderError(newTask)}
          <Link to="/" className={styles.backButton}>
            <i className="fa fa-chevron-left" />
          </Link>
          <h1>{ this.state.mode === 'edit' ? 'Edit Task' : 'New Task' }</h1>
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
                name="beginAt"
                type="date"
                component={DateTimePicker}
                label="BEGIN"
                required
              />
            </div>
            <div className={styles.inlineField}>
              <div className={styles.endIcon} />
              <Field
                name="endAt"
                type="date"
                component={DateTimePicker}
                label="END"
                required
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
            { (this.state.repeat || freqValue) &&
              <div>
                <label className="control-label" htmlFor="action">FREQUENCY</label>
                <div className="custom-select form-control">
                  <Field name="freq" component="select">
                    <option>None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </Field>
                </div>
              </div>
            }
            { (this.state.repeat || freqValue) && freqValue === 'weekly' && <div>
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
              { this.state.mode === 'edit' ? 'Save' : 'Add' }
            </button>
          </form>
        </div>
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
    const initialValues = _.get(state, 'tasks.task.task');

    return { actionValue, freqValue, initialValues };
  },
  { load: loadTask }
)(NewTaskForm);
