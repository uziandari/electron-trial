// @flow
import React, { Component } from 'react';
import type { Children } from 'react';

import Titlebar from '../components/Titlebar';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div>
        <Titlebar />
        {this.props.children}
      </div>
    );
  }
}
