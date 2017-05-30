/* eslint-disable no-unused-expressions */
import { connect } from 'react-redux';
import _ from 'lodash';
import { getCurrentTask, getCurrentTaskSuccess, getCurrentTaskFailure } from '../actions/tasks';
import Timing from '../components/Timing';

const mapStateToProps = state => ({
  currentTask: state.tasks.currentTask
});

const mapDispatchToProps = dispatch => ({
  getCurrentTask: () => {
    dispatch(getCurrentTask()).then((response) => {
      !response.error
        ? dispatch(getCurrentTaskSuccess(_.get(response, 'payload.rows[0].doc')))
        : dispatch(getCurrentTaskFailure(response.payload.rows));
      return true;
    }).catch(console.error);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timing);
