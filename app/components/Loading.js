import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LinearProgress from 'material-ui/LinearProgress';

const Loading = (props) => (

  <div style={styles.updateStyle}>
    {
      (props.status === 'filesUploading') ?
      <div style={{width: 200 }}>
        <MuiThemeProvider>
          <LinearProgress mode="determinate" value={props.filesUploaded - 1} max={props.filesToUpload} color='rgb(0, 188, 212)' style={styles.progressBar} />
        </MuiThemeProvider>
        <h4 style={{fontFamily: 'Open Sans, Arial, sans-serif'}}>Uploading Files...</h4>
      </div>
       : (props.status === 'uploadingToDatabase') ?
        <div style={{width: 200 }}>
          <MuiThemeProvider>
            <LinearProgress mode="determinate" value={80} color='rgb(0, 188, 212)' style={styles.progressBar} />
          </MuiThemeProvider>
          <h4 style={{fontFamily: 'Open Sans, Arial, sans-serif'}}>Adding to Database...</h4>
        </div>
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
  }
}

export default Loading;