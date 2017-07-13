import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress/';

const Loading = () => (
  <div style={styles.updateStyle}>
    <MuiThemeProvider>
      <CircularProgress size={60} />
    </MuiThemeProvider>
    <h3>Uploading Files (this may take some time)...</h3>
  </div>
);

const styles = {
  updateStyle: {
    marginBottom: 15
  }
}

export default Loading;