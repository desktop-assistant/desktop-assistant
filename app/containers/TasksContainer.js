/* eslint-disable no-unused-expressions */
import { connect } from 'react-redux';
import { updateTask, updateTaskSuccess, updateTaskFailure, fetchTasks, fetchTasksSuccess, fetchTasksFailure } from '../actions/tasks';
import Tasks from '../components/Tasks';
import { syncGCalendar } from '../actions/settings';

const mapStateToProps = state => ({
  tasksList: state.tasks.tasksList
});

const mapDispatchToProps = dispatch => ({
  fetchTasks: () => {
    dispatch(fetchTasks()).then((response) => {
      !response.error
        ? dispatch(fetchTasksSuccess(response.payload.docs))
        : dispatch(fetchTasksFailure(response.payload.docs));
      return true;
    }).catch(console.error);
  },
  updateTask: props => {
    dispatch(updateTask(props)).then(response => {
      !response.error
        ? dispatch(updateTaskSuccess(response.payload))
        : dispatch(updateTaskFailure(response.payload));
      return true;
    }).catch(console.error);
  },
  syncGCalendar: (check) => (dispatch(syncGCalendar(check)))
});

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
