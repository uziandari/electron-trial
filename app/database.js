// Initialize the database
const Datastore = require('nedb');
const db = new Datastore();

//{ filename: __dirname + '/db/inventory' }

db.loadDatabase((err) => console.log(err));

module.exports = db;