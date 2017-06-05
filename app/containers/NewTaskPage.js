import { connect } from 'react-redux';
import NewTask from '../components/NewTask';
import {
  resetNewTask,
  getTask, getTaskSuccess, getTaskFailure
} from '../actions/tasks';

const mapStateToProps = state => ({
  task: state.tasks.task
});

const mapDispatchToProps = dispatch => ({
  getTask: (id) => {
    const query = { selector: { _id: id } };
    dispatch(getTask(query)).then(response => {
      response.payload && response.payload.docs && response.payload.docs.length
        ? dispatch(getTaskSuccess(response.payload.docs[0]))
        : dispatch(getTaskFailure({}));

      return true;
    }).catch(console.error);
  },
  resetMe: () => {
    dispatch(resetNewTask());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTask);
