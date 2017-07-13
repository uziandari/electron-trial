// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className='home-container' style={styles.container} data-tid="container">
          <h2 style={styles.title}>Reports</h2>
          <Link to="/upload" style={styles.link}>Upload Files</Link>
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
    fontSize: '5rem'
  },
  link: {
    fontSize: '1.4rem'
  }
}

