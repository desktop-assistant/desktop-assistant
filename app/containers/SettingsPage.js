import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Settings from '../components/Settings';
import {
  syncGCalendar,
  fetchSettings, fetchSettingsSuccess, fetchSettingsFailure,
  resetSettings
} from '../actions/settings';

const mapStateToProps = state => ({
  settings: state.settings
});

const mapDispatchToProps = dispatch => ({
  fetchSettings: () => {
    dispatch(fetchSettings()).then((response) => {
      !response.error
        ? dispatch(fetchSettingsSuccess(response.payload.docs))
        : dispatch(fetchSettingsFailure(response.payload.docs));
      return true;
    }).catch(console.error);
  },
  syncGCalendar: () => (dispatch(syncGCalendar())),
  resetSettings: () => (dispatch(resetSettings())),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
