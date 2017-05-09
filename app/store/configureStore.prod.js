import { createStore, applyMiddleware, compose } from 'redux';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import promise from 'redux-promise';
import rootReducer from '../reducers';

const router = routerMiddleware(hashHistory);
/* eslint-disable no-underscore-dangle */
const composeEnhancers = compose;
/* eslint-enable no-underscore-dangle */
const enhancer = composeEnhancers(
  applyMiddleware(promise, router)
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  return store;
}
