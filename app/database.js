// Initialize the database
const Datastore = require('nedb');
const nsdb = new Datastore({ filename: __dirname + '/db/nsinventory' });
const cadb = new Datastore({ filename: __dirname + '/db/cainventory' });
const receiptdb = new Datastore({ filename: __dirname + '/db/newreceipts' });

// const nsdb = new Datastore();
// const cadb = new Datastore();
// const receiptdb = new Datastore();

nsdb.loadDatabase((err) => console.log(err));
cadb.loadDatabase((err) => console.log(err));
receiptdb.loadDatabase((err) => console.log(err));

nsdb.ensureIndex({ fieldName: 'sku'}, function (err) {
  console.log(err)
});

cadb.ensureIndex({ fieldName: 'sku', unique: true }, function (err) {
  console.log(err)
});

cadb.ensureIndex({ fieldName: 'flag'}, function (err) {
  console.log(err)
});

cadb.ensureIndex({ fieldName: 'quantityAvailable'}, function (err) {
  console.log(err)
});



receiptdb.ensureIndex({ fieldName: 'sku', unique: true }, function (err) {
  console.log(err)
});


module.exports = {
  nsdb,
  cadb,
  receiptdb
};