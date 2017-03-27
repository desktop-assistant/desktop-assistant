import { connect } from 'react-redux'
import { fetchTasks, fetchTasksSuccess, fetchTasksFailure } from '../actions/tasks';
import Tasks from '../components/Tasks';


const mapStateToProps = (state) => {
  return {
    tasksList: state.tasks.tasksList
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTasks: () => {
      dispatch(fetchTasks()).then((response) => {
        !response.error ? dispatch(fetchTasksSuccess(response.payload.docs)) : dispatch(fetchTasksFailure(response.payload.docs));
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
