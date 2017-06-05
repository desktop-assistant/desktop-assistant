/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import { RouteTransition } from 'react-router-transition';

import App from './containers/App';
import HomePage from './containers/HomePage';
import NewTaskPage from './containers/NewTaskPage';
import SettingsPage from './containers/SettingsPage';

const presets = {
  main: {
    atEnter: { opacity: 0, translateX: -100 },
    atLeave: { opacity: 1, translateX: 100 },
    atActive: { opacity: 1, translateX: 0 },
    mapStyles(styles) {
      return {
        opacity: styles.opacity,
        transform: `translateX(${styles.translateX}%)`
      };
    }
  },
  nested: {
    atEnter: { opacity: 0, translateX: 100 },
    atLeave: { opacity: 1, translateX: -100 },
    atActive: { opacity: 1, translateX: 0 },
    mapStyles(styles) {
      return {
        opacity: styles.opacity,
        transform: `translateX(${styles.translateX}%)`
      };
    }
  }
};

const transition = {
  default: presets.main,
  '/settings': presets.nested,
  '/add': presets.nested
};

export default () => (
  <App>
    <Route
      render={({ location }) => (
        <RouteTransition
          pathname={location.pathname}
          {... transition[location.pathname] || transition.default}
          runOnMount={false}
        >
          <Switch key={location.key} location={location}>
            <Route path="/add/:id?" component={NewTaskPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </RouteTransition>
      )}
    />
  </App>
);
