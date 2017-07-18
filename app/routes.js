/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';

//containers
import HomePage from './containers/HomePage';
import Upload from './containers/Upload';
import ReportsPage from './containers/ReportsPage';

export default () => (
  <App>
    <Switch>
      <Route path="/upload" component={Upload} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
