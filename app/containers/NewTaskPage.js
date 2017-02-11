import NewTask from '../components/NewTask';
import { resetNewTask } from '../actions/tasks';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => {
  return {
    resetMe: () => {
      dispatch(resetNewTask());
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    // newTask: state.tasks.newTask
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTask);
