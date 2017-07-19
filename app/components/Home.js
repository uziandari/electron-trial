// @flow
import React, { Component } from 'react';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className='home-container' style={styles.container} data-tid="container">
          <h2 style={styles.title}>Reports</h2>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    top: '30%',
    left: '10px',
    textAlign: 'center'
  },
  title: {
    fontSize: '5rem',
    fontWeight: 400,
    letterSpacing: '-0.025rem'
  }
}

