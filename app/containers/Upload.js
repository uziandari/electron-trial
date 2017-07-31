import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dropzone from 'react-dropzone';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ContentAddCircleOutline from '../../node_modules/material-ui/svg-icons/content/add-circle-outline';
import ActionCheckCircle from '../../node_modules/material-ui/svg-icons/action/check-circle';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import ActionInfo from 'material-ui/svg-icons/action/info';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import ReportsPage from './ReportsPage';
import Loading from '../components/Loading';

//database
import { nsdb, cadb, receiptdb, relistdb, removesdb, inventorydb } from '../database';

//utilities import
import determineFile from '../utilities/determineFile';

import fs from 'fs';
import Parse from 'csv-parse'
import fileFilter from '../utilities/fileFilter';
import buildSchema from '../utilities/buildSchema';

injectTapEventPlugin();
export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filesPreview: [],
      filesToBeSent: [],
      rejectedFiles: [],
      fileMatch: {
        CurrentInventoryResults: 'NS Inventory',
        InventoryExport: 'CA Inventory',
        NewReceiptsSearch: 'New Receipts',
        relist: 'To Relist',
        removes: 'To Remove'
      },
      filesUploading: 'notLoaded',
      filesUploaded: 0
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
    })
  }

  deleteElement (index) {
    this.setState({
      filesToBeSent: this.state.filesToBeSent.filter((event, i) => {
        return i !== index;
      }),
      filesPreview: this.state.filesPreview.filter((event, i) => {
        return i !== index;
      })
    });
  }

  handleClick(event) {
    if (this.state.filesToBeSent.length > 0) {
      let filesArray = this.state.filesToBeSent;
      let filesRead = 0;
      let that = this;

      this.setState({
        filesUploading: 'filesUploading'
      });

      function done() {
        filesRead++;
        that.setState({
          filesUploaded: filesRead
        });
        console.log(`Files read: ${filesRead}`)
        if (filesRead === that.state.filesToBeSent.length) {
          cadb.find({})
          .then((result) => {
            return Promise.all(result.map((doc) => {
              return nsdb.find({sku: doc.sku}).then((res) => {
                return receiptdb.find({sku: doc.sku}).then((receipt) => {
                  return removesdb.find({sku: doc.sku}).then((remove) => {
                    return relistdb.find({sku: doc.sku}).then((relist) => {
                      return Object.assign(doc, ...res, ...receipt, ...remove, ...relist);
                    }) 
                  })
                })
              });
            })
          );
          })
          .then((results) => {
            inventorydb.insert(results)
              .then((results) => {
                console.log(`inserted ${results.length} items into the db`)
                return that.setState({
                  filesUploading: 'uploadComplete'
                });
              });
          })
          .catch((err) => console.log(err))
        }
      }      
        
      for (let i in filesArray) {
        let recordName = this.state.filesPreview[i].toLowerCase().replace(/\s+/g, '');
        parseFile(filesArray[i].path, filesArray[i].name, recordName, done)
      }

      
    }
  }

  render() {

    const filesList = Object.keys(this.state.fileMatch).map((key) => {
      return <ListItem key={key} primaryText={this.state.fileMatch[key]} style={styles.filesListStyle} 
                        leftIcon={<Checkbox checked={(this.state.filesPreview.indexOf(this.state.fileMatch[key]) > -1)}
                                  onCheck={() => this.deleteElement(this.state.filesPreview.indexOf(this.state.fileMatch[key]))}
                                  iconStyle={{fill: '#61efa7'}}
                                  />} 
                        rightIcon={<ActionInfo 
                          style={{fill: 'rgba(0, 10, 25, 0.4)'}}
                        />}
        />
    });

    return (
      <div className="upload">
        <div className='drop-container' style={styles.dropContainer}>
          <div className='files-list' style={styles.fileList}>
            <h3 style={styles.subtitle}>Uploads</h3>
            <hr style={{width: '80%'}}/>
            <MuiThemeProvider>
              <List>
                {filesList}
              </List>
            </MuiThemeProvider>
          </div>
          <div className='drop-area' style={styles.dropArea}>
            <Dropzone 
              accept=".txt, .csv, text/plain, application/vnd.ms-excel"
              style={styles.dropzoneStyle} 
              onDrop={(files, rejected) => this.onDrop(files, rejected)}>
              <div>
                Drop files here or click to select files.
              </div>
            </Dropzone>
          
          <MuiThemeProvider>
            <RaisedButton label="Upload Files" 
                          disabled={this.state.filesToBeSent.length === 0 ? true : false }
                          disabledBackgroundColor='rgba(0, 10, 25, 0.1)'
                          disabledLabelColor='rgba(0, 10, 25, 0.5)'
                          style={styles.loadButton}
                          labelColor='#61efa7'
                          labelStyle={{fontFamily: 'Open Sans, Arial, sans-serif'}}
                          backgroundColor='rgba(0, 10, 25, 0.5)'
                          onClick={(event) => this.handleClick(event)}
            />
          </MuiThemeProvider>
          </div>
        </div>
        <div className='upload-status' style={styles.uploadStatus}>
          <Loading status={this.state.filesUploading} filesToUpload={this.state.filesToBeSent} filesUploaded={this.state.filesUploaded} />
        </div>
        {/*reports page*/}
      </div>
    )
  }
}

const styles = {
  dropzoneStyle: {
    width: '90%',
    height: '100%',
    border: '1px groove #61efa7',
    marginRight: '5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropContainer: {
    display: 'flex',
  },
  uploadStatus: {
    marginTop: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'    
  },
  subtitle: {
    alignSelf: 'center',
    fontFamily: 'Maven Pro, Arial, sans-serif'
  },
  fileList: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column'
  },
  dropArea: {
    height: 360,
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  filesListStyle: {
    color: '#fff',
    fontFamily: 'Open Sans, Arial, sans-serif'
  },
  loadButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 10,
    border: '1px solid rgba(0, 0, 0, 0.4)',
    borderRadius: 4,
    bottomBorderColor: '1px solid rgba(0, 0, 0, 0.5)',
    boxShadow: '0 5px 12px -2px rgba(0, 0, 0, 0.3)',
  }
};

const parseFile = (filePath, fileName, recordName, done) => {
  let source = fs.createReadStream(filePath);
  
  let linesRead = 0;

  let output = [];

  let delimeter = fileFilter(fileName);

  let parser = Parse({
    delimiter: delimeter,
    columns: true 
  });

  parser.on("readable", () => {
    let record;
    while (record = parser.read()) {
      linesRead++;
      const recordSchema = buildSchema(record, recordName)
      output.push(recordSchema)   
    }
  });

  parser.on("error", (error) => console.log(error));

  parser.on("end", () => {
    if (recordName === 'nsinventory') {
      nsdb.insert(output)
        .then(() => done())
        .catch((err) => console.log(err))
    } else if (recordName === 'cainventory') {
      cadb.insert(output)
        .then(() => done())
        .catch((err) => console.log(err))
    } else if (recordName === 'newreceipts') {
      receiptdb.insert(output)
        .then(() => done())
        .catch((err) => console.log(err))
    } else if (recordName === 'torelist') {
      relistdb.insert(output)
        .then(() => done())
        .catch((err) => console.log(err))
    } else if (recordName === 'toremove') {
      removesdb.insert(output)
        .then(() => done())
        .catch((err) => console.log(err))
    }
  });

  source.pipe(parser);
} 