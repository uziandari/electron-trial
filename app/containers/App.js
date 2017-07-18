// @flow
import React, { Component } from 'react';
import type { Children } from 'react';

import Navigation from '../components/Navigation';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div>
        <Navigation />
        {this.props.children}
      </div>
    );
  }
}
