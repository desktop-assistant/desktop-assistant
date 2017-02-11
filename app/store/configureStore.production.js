// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import promise from 'redux-promise';

const router = routerMiddleware(hashHistory);

// const enhancer = applyMiddleware(thunk, router);
const enhancer = applyMiddleware(promise)

export default function configureStore() {
  return createStore(rootReducer, initialState, enhancer); // eslint-disable-line
}
