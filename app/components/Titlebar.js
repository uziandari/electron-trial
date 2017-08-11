import React from 'react';

const Titlebar = () => {
  return (
    <div className="title" style={styles.titlebar}>
      <h3 style={styles.title}>Reports Generator<span style={styles.versionNumber}>v0.4</span></h3>
    </div>
  );
};

export default Titlebar;

const styles = {
  titlebar: {
    margin: 0,
    padding: '1em',
    borderBottom: '2px solid rgba(255, 64, 129, 0.6)',
    width: '100vw',
    backgroundColor: 'rgb(0, 188, 212)',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  title: {
    color: '#fff',
    fontFamily: 'Open Sans, sans-serif',
    paddingRight: '0.8em',
  },
  versionNumber: {
    color: '#000',
    fontSize: '0.5em',
    marginRight: '1.5em'
  }
}