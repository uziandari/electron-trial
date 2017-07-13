'use strict'

const fs = require('fs');
const Parse = require('csv-parse');
const fileFilter = require('./fileFilter');
const buildSchema = require('./buildSchema');

//database
const db =  require('../database');

const parseFile = (filePath, fileName, recordName) => {
  let source = fs.createReadStream(filePath);
  
  let linesRead = 0;

  let delimeter = fileFilter(fileName);

  let parser = Parse({
    delimiter: delimeter,
    columns: true 
  });

  parser.on("readable", () => {
    let record;
    while (record = parser.read()) {
      const recordSchema = buildSchema(record, recordName)
      linesRead++;
      db.update(
        {_id: record[Object.keys(record)[0]]},
        {$addToSet: {recordSchema}},
        {upsert: true}, 
        (err) => {
        if (err) {
          console.log(err)
        }
      });
    }
  });

  parser.on("error", (error) => console.log(error));

  parser.on("end", () => console.log(`lines: ${linesRead}`));

  source.pipe(parser);
} 


module.exports = parseFile;