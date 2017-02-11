import React, { Component } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Link } from 'react-router';
import styles from './NewTask.css';
import renderField from './renderField';
import { createTask } from '../actions/tasks';

// Client side validation
function validate(values) {
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
const validateAndCreateTask = (values, dispatch) => {
  console.log('validateAndCreateTask')
  return dispatch(createTask(values))
    .then(result => {
      console.log('result', result);
      // Note: Error's "data" is in result.payload.response.data (inside "response")
      // success's "data" is in result.payload.data
      // if (result.payload.response && result.payload.response.status !== 200) {
      //   dispatch(createPostFailure(result.payload.response.data));
      //   throw new SubmissionError(result.payload.response.data);
      // }
      // //let other components know that everything is fine by updating the redux` state
      // dispatch(createPostSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
    });
}

class NewTask extends Component {
  props: {
    // handleSuxbmit: () => void,
    submitting: Boolean,
    newTask: Object,
    router: Object
  };

  // componentWillMount() {
  //   //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
  //   //always reset that global state back to null when you REMOUNT
  //   this.props.resetMe();
  // }

  renderError(newTask) {
    if (newTask && newTask.error && newTask.error.message) {
      return (
        <div className="alert alert-danger">
          { newTask ? newTask.error.message : '' }
        </div>
        );
    } else {
      return <span></span>
    }
  }

  render() {
    // const {handleSubmit, submitting, newPost} = this.props;
    const {handleSubmit, submitting, newTask} = this.props

    return (
      <div className='container'>
        { this.renderError(newTask) }
        <form className={ styles.container }>
          <div className={ styles.back }>
            <Link to="/">
              <i className="fa fa-chevron-left" />
            </Link>
            <form onSubmit={ handleSubmit(validateAndCreateTask) }>
              <Field
                name="name"
                type="text"
                component={ renderField }
                label="Task name*" />
              <Field
                name="beginAt"
                type="time"
                component={ renderField }
                label="Begin at*" />
              <Field
                name="endAt"
                type="time"
                component={ renderField }
                label="End at*" />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={ submitting }>
                Submit
              </button>
              <Link
                to="/"
                className="btn btn-error"> Cancel
              </Link>
            </form>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'NewTask', // a unique identifier for this form
  validate // <--- validation function given to redux-form
  // asyncValidate
})(NewTask)
