'use strict'

const fs = require('fs');
const Parse = require('csv-parse');
const fileFilter = require('./fileFilter');
const buildSchema = require('./buildSchema');

//database
const { nsdb, cadb, receiptdb } =  require('../database');

const parseFile = (filePath, fileName, recordName) => {
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
      nsdb.insert(output, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('ns inventory added to db.');
      });
    } else if (recordName === 'cainventory') {
      cadb.insert(output, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('ca inventory added to db.');
      });
    } else if (recordName === 'newreceipts') {
      receiptdb.insert(output, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('new receipts added to db.');
      });
    }
  });

  source.pipe(parser);
} 


module.exports = parseFile;