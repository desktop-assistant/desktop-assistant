// @flow
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import rootReducer from '../reducers';

const enhancer = applyMiddleware(promise);

export default function configureStore() {
  return createStore(rootReducer, initialState, enhancer); // eslint-disable-line
}
