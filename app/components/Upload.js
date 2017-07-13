import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dropzone from 'react-dropzone';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import {red500} from 'material-ui/styles/colors';
import ContentAddCircleOutline from '../../node_modules/material-ui/svg-icons/content/add-circle-outline';
import ActionCheckCircle from '../../node_modules/material-ui/svg-icons/action/check-circle';

import Loading from '../components/Loading';
import LoadingComplete from '../components/LoadingComplete';

//database
import { nsdb, cadb, receiptdb } from '../database';

//utilities import
import parseFile from '../utilities/parseFile';
import determineFile from '../utilities/determineFile';

injectTapEventPlugin();
export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filesPreview: [],
      filesToBeSent: [],
      rejectedFiles: [],
      fileMatch: {
        NewReceiptsSearch: 'New Receipts',
        CurrentInventoryResults: 'NS Inventory',
        InventoryExport: 'CA Inventory'
      },
      filesUploading: false,
      filesUploaded: false
    }
  }

  onDrop (acceptedFiles, rejectedFiles) {
    let filesToBeSent = this.state.filesToBeSent;
    let filesPreview = this.state.filesPreview;
    
    for (let i in acceptedFiles) {
      let file = determineFile(acceptedFiles[i].name);

      let fileInState = filesToBeSent.some((el) => el.name === acceptedFiles[i].name);

      if (file.length > 0) {
        if (fileInState) {
          Object.keys(acceptedFiles[i]).map(file => filesToBeSent.find(o => o.name === file.name));
          console.log('file replaced', acceptedFiles[i])
        } else {
          filesToBeSent.push(acceptedFiles[i]);
          filesPreview.push(this.state.fileMatch[file]);
        }
        this.setState({filesToBeSent, filesPreview});
      } else {
        console.log(`file ${acceptedFiles[i].name} was not accepted.`)
      }
      
    }
       
    this.setState({
      rejectedFiles,
      filesUploading: false,
      filesUploaded: false
    })
  }

  deleteElement (index) {
    this.setState({
      filesToBeSent: this.state.filesToBeSent.filter((event, i) => {
        return i !== index;
      }),
      filesPreview: this.state.filesPreview.filter((event, i) => {
        return i !== index;
      }),
      filesUploading: false,
      filesUploaded: false
    });
  }

  handleClick (event) {
    if (this.state.filesToBeSent.length > 0) {
      let filesArray = this.state.filesToBeSent;
      
      for (let i in filesArray) {
        let recordName = this.state.filesPreview[i].toLowerCase().replace(/\s+/g, '');
        parseFile(filesArray[i].path, filesArray[i].name, recordName)
      }

      this.setState({
        filesUploading: true,
        filesUploaded: false
      });
    }
  }

  //testing db find
  handleFind(event) {
    let item = {}
    nsdb.find({sku: '33RBKRSEABVMENMD111WHT01'}, function (err, docs) {
      if (docs.length > 1) {
        item = Object.assign(item, docs[0])
      }
    });
    cadb.find({sku: '33RBKRSEABVMENMD111WHT01'}, function (err, docs) {
      item = Object.assign(item, docs[0])
    });
    receiptdb.find({sku: '33RBKRSEABVMENMD111WHT01'}, function (err, docs) {
      item = Object.assign(item, docs[0])
      console.log('item is', item)
    });  
        
  }

  render() {

    const filesCheck = Object.keys(this.state.fileMatch).map((key) => {
        return <li key={key}>{this.state.fileMatch[key]}
          {(this.state.filesPreview.indexOf(this.state.fileMatch[key]) > -1) ? 
          <span>
          <MuiThemeProvider>
            <ActionCheckCircle />
          </MuiThemeProvider>
          <MuiThemeProvider>
            <IconButton tooltip="Remove File" onClick={() => this.deleteElement(this.state.filesPreview.indexOf(this.state.fileMatch[key]))} >
              <ContentClear color={red500} />
            </IconButton>  
          </MuiThemeProvider>
          </span> :
          null
          }
        </li>
    });

    return (
      <div className="upload">
        <MuiThemeProvider>
          <div>
            {/*appbar*/}
          </div>
        </MuiThemeProvider>
        <center>
          <div className='drop-area' style={styles.dropArea}>
            <Dropzone 
              accept=".txt, .csv, text/plain, application/vnd.ms-excel"
              style={styles.dropzoneStyle} 
              onDrop={(files, rejected) => this.onDrop(files, rejected)}>
              <div>
                Drop files here or click to select files.
              </div>
            </Dropzone>
          </div>
          <MuiThemeProvider>
            <RaisedButton label="Upload Files" primary={true} disabled={this.state.filesToBeSent.length === 0 ? true : false } style={styles.button}
              onClick={(event) => this.handleClick(event)}
            />
          </MuiThemeProvider>

          <MuiThemeProvider>
            <RaisedButton label="DB" primary={true} style={styles.button}
              onClick={(event) => this.handleFind(event)}
            />
          </MuiThemeProvider>

          {
            (this.state.filesUploading) ? 
              <div style={styles.divStyle}>
                <Loading />
              </div> : (this.state.filesUploaded) ?
              <div style={styles.divStyle}>
                <LoadingComplete />
              </div> : null
          }
        </center>
        <div className='files-grid'>
          <h3>Uploads</h3>
          <ul>
            {filesCheck}
          </ul>
        </div>
      </div>
    )
  }
}

const styles = {
  dropzoneStyle: {
    width: '80%',
    height: '100%',
    border: '1px groove rgb(232, 232, 232)',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropArea: {
    width: '100vw',
    height: 360
  },
  divStyle: {
    margin: 15
  },
  button: {
    margin: 15
  },
  filesListStyle: {
    marginTop: 15
  },
  list: {
    listStyle: 'none',
    margin: 0
  }
};