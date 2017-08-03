// Initialize the database
const Datastore = require('nedb-promises');
// const nsdb = new Datastore({ filename: __dirname + '/db/nsinventory' });
// const cadb = new Datastore({ filename: __dirname + '/db/cainventory' });
// const receiptdb = new Datastore({ filename: __dirname + '/db/newreceipts' });
// const relistdb = new Datastore({ filename: __dirname + '/db/relist' });
// const removesdb = new Datastore({ filename: __dirname + '/db/removes' });
// const inventorydb = new Datastore({ filename: __dirname + '/db/inventory' });

const nsdb = new Datastore();
const cadb = new Datastore();
const receiptdb = new Datastore();
const relistdb = new Datastore();
const removesdb = new Datastore();
const inventorydb = new Datastore();

// inventorydb.loadDatabase((err) => console.log(err));
// nsdb.loadDatabase((err) => console.log(err));
// cadb.loadDatabase((err) => console.log(err));
// receiptdb.loadDatabase((err) => console.log(err));
// relistdb.loadDatabase((err) => console.log(err));
// removesdb.loadDatabase((err) => console.log(err));

nsdb.ensureIndex({ fieldName: 'sku'}, (err) => {
  console.log(err)
});

cadb.ensureIndex({ fieldName: 'sku', unique: true }, (err) => {
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

//inventorydb indexes
const fieldNames = [
  'bin', 'committed', 'dropShip', 'flag', 'inline', 'invLocation',
  'pendingCheckout', 'pendingPayment', 'pendingShipment', 'quantity', 'quantityAvailable', 
  'relist', 'remove', 'sku'
];

fieldNames.forEach((field) => {
  inventorydb.ensureIndex({ fieldName: field, sparse: true}, (err) => {
    console.log(err)
  });
})
//end inventorydb indexes

module.exports = {
  nsdb,
  cadb,
  receiptdb,
  relistdb,
  removesdb,
  inventorydb
};