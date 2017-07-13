const buildSchema = (record, recordName) => {
  switch (recordName) {
    case "newreceipts":
      return ({
        _id: record['Name'],
        receiptDate: record['Maximum of Date'],
        updatedAt: Date.now()
      });
    case "nsinventory":
      return ({
        _id: record['Name'],
        description: record['Description'],
        invLocation: record['Inventory Location'],
        quantity: parseInt(record['Location On Hand'], 10),
        //committed: parseInt(record['Location On Hand'], 10),
        upc: record['CustomUPC'],
        bin: record['Bin'],
        backStock: record['Backstock'],
        inline: record['Inline'],
        dropShip: record['Drop Ship Item'],
        cost: record['Maximum of Average Cost'],
        updatedAt: Date.now()
      });
    case "cainventory":

      let pulledQuantity = record['DC Quantity'].match((/\d+$/));

      return ({
        _id: record['Inventory Number'],
        quantityAvailable: parseInt(pulledQuantity[0], 10),
        pendingCheckout: parseInt(record['Quantity Pooled Pending Checkout'], 10),
        pendingPayment: parseInt(record['Quantity Pooled Pending Payment'], 10),
        pendingShipment: parseInt(record['Quantity Pooled Pending Shipment'], 10),
        flag: record['FlagDescription'],
        parentSku: record['Variation Parent SKU'],
        updatedAt: Date.now() 
      });
    default:
      return null;
  }
}

module.exports = buildSchema;