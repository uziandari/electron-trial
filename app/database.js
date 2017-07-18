// Initialize the database
const Datastore = require('nedb');
// const nsdb = new Datastore({ filename: __dirname + '/db/nsinventory' });
// const cadb = new Datastore({ filename: __dirname + '/db/cainventory' });
// const receiptdb = new Datastore({ filename: __dirname + '/db/newreceipts' });
// const relistdb = new Datastore({ filename: __dirname + '/db/relist' });
// const removesdb = new Datastore({ filename: __dirname + '/db/removes' });

const nsdb = new Datastore();
const cadb = new Datastore();
const receiptdb = new Datastore();
const relistdb = new Datastore();
const removesdb = new Datastore();

nsdb.loadDatabase((err) => console.log(err));
cadb.loadDatabase((err) => console.log(err));
receiptdb.loadDatabase((err) => console.log(err));
relistdb.loadDatabase((err) => console.log(err));
removesdb.loadDatabase((err) => console.log(err));

nsdb.ensureIndex({ fieldName: 'sku'}, (err) => {
  console.log(err)
});

cadb.ensureIndex({ fieldName: 'sku', unique: true }, (err) => {
  console.log(err)
});

cadb.ensureIndex({ fieldName: 'flag'}, (err) => {
  console.log(err)
});

cadb.ensureIndex({ fieldName: 'quantityAvailable'}, (err) => {
  console.log(err)
});

receiptdb.ensureIndex({ fieldName: 'sku', unique: true }, (err) => {
  console.log(err)
});

relistdb.ensureIndex({ fieldName: 'sku', unique: true }, (err) => {
  console.log(err)
});

removesdb.ensureIndex({ fieldName: 'sku', unique: true }, (err) => {
  console.log(err)
});

module.exports = {
  nsdb,
  cadb,
  receiptdb,
  relistdb,
  removesdb
};