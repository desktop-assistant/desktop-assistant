/* eslint-disable no-unused-expressions */
import { connect } from 'react-redux';
import moment from 'moment';
import { updateTask, updateTaskSuccess, updateTaskFailure, fetchTasks, fetchTasksSuccess, fetchTasksFailure } from '../actions/tasks';
import Tasks from '../components/Tasks';
import { syncGCalendar } from '../actions/settings';

const mapStateToProps = state => ({
  tasksList: state.tasks.tasksList
});

const mapDispatchToProps = dispatch => ({
  fetchTasks: currentDay => {
    const mCurrentDay = currentDay || moment();
    const start = mCurrentDay.toDate();
    start.setHours(0, 0, 0, 0);
    const end = mCurrentDay.toDate();
    end.setHours(23, 59, 59, 999);
    dispatch(fetchTasks('complex', start, end)).then((response) => {
      !response.error
        ? dispatch(fetchTasksSuccess(response.payload.rows))
        : dispatch(fetchTasksFailure(response.payload.rows));
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
