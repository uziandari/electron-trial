const Parse = require('csv-parse');
const fs = require('fs');

const fileFilter = require('./fileFilter');

const fileMatch = ['NewReceiptsSearch', 'CurrentInventoryResults', 'InventoryExport', 'relist', 'removes'];

const determineFile = (fileName) => {
    return fileMatch.filter((file) => fileName.indexOf(file) > -1);
}

module.exports = determineFile;