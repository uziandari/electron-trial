/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';

//containers
import Upload from './containers/Upload';

export default () => (
  <App>
    <Switch>
      <Route path="/" component={Upload} />
    </Switch>
  </App>
);
