// @flow
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(promise, router);

function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
