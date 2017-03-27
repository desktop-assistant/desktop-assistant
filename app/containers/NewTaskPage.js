import { connect } from 'react-redux';
import NewTask from '../components/NewTask';
import { resetNewTask } from '../actions/tasks';

const mapDispatchToProps = (dispatch) => ({
  resetMe: () => {
    dispatch(resetNewTask());
  }
});

function mapStateToProps() {
  return {
    // newTask: state.tasks.newTask
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTask);
