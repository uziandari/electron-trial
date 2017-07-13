/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';

//containers
import HomePage from './containers/HomePage';
import UploadPage from './containers/UploadPage';

export default () => (
  <App>
    <Switch>
      <Route path="/upload" component={UploadPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
