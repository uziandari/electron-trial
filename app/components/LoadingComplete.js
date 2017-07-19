import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';

const LoadingComplete = () => (
  <div style={styles.updateStyle}>
    <MuiThemeProvider>
      <ActionDoneAll color='#ff9191' style={styles.largeIcon}/>
    </MuiThemeProvider>
  </div>
);

const styles = {
  largeIcon: {
    width: 40,
    height: 40,
  },
  updateStyle: {
    marginBottom: 15
  }
};

export default LoadingComplete;