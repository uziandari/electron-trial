const buildSchema = (record, recordName) => {
  switch (recordName) {
    case "newreceipts":
      return ({
        sku: record['Name'],
        receiptDate: record['Maximum of Date'],
        updatedAt: Date.now()
      });
    case "nsinventory":

      let parsedQuantity = parseInt(record['Location On Hand'], 10) || 0;
      let parsedCommitted = parseInt(record['Sum of Committed'], 10) || 0;

      return ({
        sku: record['Name'],
        description: record['Description'],
        invLocation: record['Inventory Location'],
        quantity: parsedQuantity,
        committed: parsedCommitted,
        upc: record['CustomUPC'],
        bin: record['Bin'],
        backStock: record['Backstock'],
        inline: record['Inline'],
        dropShip: record['Drop Ship Item'],
        cost: record['Maximum of Average Cost'],
        updatedAt: Date.now()
      });
    case "cainventory":

      let pulledQuantity = record['DC Quantity'].match((/\-?\d+$/));

      return ({
        sku: record['Inventory Number'],
        quantityAvailable: parseInt(pulledQuantity[0], 10),
        pendingCheckout: parseInt(record['Quantity Pooled Pending Checkout'], 10),
        pendingPayment: parseInt(record['Quantity Pooled Pending Payment'], 10),
        pendingShipment: parseInt(record['Quantity Pooled Pending Shipment'], 10),
        flag: record['FlagDescription'],
        parentSku: record['Variation Parent SKU'],
        updatedAt: Date.now() 
      });
    case "torelist":
      return ({
        sku: record['Sku'],
        relist: true,
        updatedAt: Date.now() 
      });
    case "toremove":
      return ({
        sku: record['Sku'],
        remove: true,
        updatedAt: Date.now() 
      });
    default:
      return ({
        sku: record['Sku'],
        updatedAt: Date.now()
      });
  }
}

module.exports = buildSchema;