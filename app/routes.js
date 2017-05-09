/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import NewTaskPage from './containers/NewTaskPage';

export default () => (
  <App>
    <Switch>
      <Route path="/add" component={NewTaskPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
