/* eslint-disable no-unused-expressions */
import { connect } from 'react-redux';
import { fetchTasks, fetchTasksSuccess, fetchTasksFailure } from '../actions/tasks';
import Tasks from '../components/Tasks';

const mapStateToProps = (state) => ({
  tasksList: state.tasks.tasksList
});

const mapDispatchToProps = (dispatch) => ({
  fetchTasks: () => {
    dispatch(fetchTasks()).then((response) => {
      !response.error
      ? dispatch(fetchTasksSuccess(response.payload.docs))
      : dispatch(fetchTasksFailure(response.payload.docs));
      return true;
    }).catch(console.error);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
