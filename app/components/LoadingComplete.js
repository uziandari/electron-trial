import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';
import {blue500} from 'material-ui/styles/colors';


const LoadingComplete = () => (
  <div style={styles.updateStyle}>
    <MuiThemeProvider>
      <ActionDoneAll color={blue500} style={styles.largeIcon}/>
    </MuiThemeProvider>
     <h3>Uploaded all files.</h3>
  </div>
);

const styles = {
  largeIcon: {
    width: 60,
    height: 60,
  },
  updateStyle: {
    marginBottom: 15
  }
};

export default LoadingComplete;