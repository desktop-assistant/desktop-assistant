import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Settings from '../components/Settings';
import * as TasksActions from '../actions/tasks';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TasksActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
