/* eslint-disable no-unused-expressions */
import { connect } from 'react-redux';
import { resetDeletedTask, deleteTask, deleteTaskSuccess, deleteTaskFailure } from '../actions/tasks';
import Task from '../components/Task';

const mapStateToProps = (state) => {
  return {
    deleteTask: state.tasks.deletedTask
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDeleteClick: () => {
    dispatch(deleteTask(ownProps.task)).then(response => {
      !response.error
        ? dispatch(deleteTaskSuccess(response.payload))
        : dispatch(deleteTaskFailure(response.payload));

      return true;
    }).catch(console.error);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Task);
