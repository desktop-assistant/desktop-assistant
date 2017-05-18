/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import { RouteTransition } from 'react-router-transition';

import App from './containers/App';
import HomePage from './containers/HomePage';
import NewTaskPage from './containers/NewTaskPage';
import SettingsPage from './containers/SettingsPage';

export default () => (
  <App>
    <Route
      render={({ location }) => {
        return (
          <RouteTransition
            pathname={location.pathname}
            atEnter={{ translateX: location.pathname === '/settings' ? 100 : -100 }}
            atLeave={{ translateX: location.pathname === '/settings' ? -100 : 100 }}
            atActive={{ translateX: 0 }}
            mapStyles={styles => ({ transform: `translateX(${styles.translateX}%)` })}
            runOnMount={false}
          >
            <Switch key={location.key} location={location}>
              <Route path="/add" component={NewTaskPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/" component={HomePage} />
            </Switch>
          </RouteTransition>
        );
      }}
    />
  </App>
);
