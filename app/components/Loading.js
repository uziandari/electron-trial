import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from 'material-ui/LinearProgress';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';

const Loading = (props) => (

  <div style={styles.updateStyle}>
    {
      (props.status === 'filesUploading') ?
      <div style={{width: 300 }}>
        <MuiThemeProvider>
          <LinearProgress mode="determinate" value={props.filesUploaded - 1} max={props.filesToUpload} color='#ff9191' style={styles.progressBar} />
        </MuiThemeProvider>
        <h4 style={{fontFamily: 'Open Sans, Arial, sans-serif'}}>Uploading Files...</h4>
      </div>
       : (props.status === 'uploadingToDatabase') ?
        <div style={{width: 300 }}>
          <MuiThemeProvider>
            <LinearProgress mode="determinate" value={80} color='#ff9191' style={styles.progressBar} />
          </MuiThemeProvider>
          <h4 style={{fontFamily: 'Open Sans, Arial, sans-serif'}}>Adding to Database...</h4>
        </div>
       : (props.status === 'uploadComplete') ?
        <MuiThemeProvider>
          <ActionDoneAll color='#ff9191' style={styles.largeIcon}/>
        </MuiThemeProvider>
       : null
    } 
  </div>
);

const styles = {
  updateStyle: {
    marginBottom: 15
  },
  progressBar: {
    backgroundColor: 'rgba(0, 10, 25, 0.4)'
  },
   largeIcon: {
    width: 40,
    height: 40,
  }
}

export default Loading;