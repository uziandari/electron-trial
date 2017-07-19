import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from 'material-ui/LinearProgress';

const Loading = () => (
  <div style={styles.updateStyle}>
    <MuiThemeProvider>
      <LinearProgress mode="indeterminate" color='#ff9191' style={styles.progressBar} />
    </MuiThemeProvider>
    <h4 style={{fontFamily: 'Open Sans, Arial, sans-serif'}}>Uploading Files (this may take some time)...</h4>
  </div>
);

const styles = {
  updateStyle: {
    marginBottom: 15
  },
  progressBar: {
    backgroundColor: 'rgba(0, 10, 25, 0.4)'
  }
}

export default Loading;