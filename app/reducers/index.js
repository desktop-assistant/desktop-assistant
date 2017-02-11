// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form'

import tasks from './tasks';

const rootReducer = combineReducers({
  routing,
  form,
  tasks
});

export default rootReducer;
