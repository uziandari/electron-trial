import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Workbook from 'react-excel-workbook';


import { inventorydb } from '../database';

export default class ReportsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessNine: [],
      alerts: [],
      delist: [],
      relist: [],
      relistPushed: [],
      negatives: [],
      isLoading: true,
      value: ''
    }    
  }

  async findLessNine() {
    let results = await inventorydb.find({ 
      $and: [
        {quantityAvailable: {$lt: 10, $gt: 0}}, 
        {$not: {flag: {$regex: /briantest|inline|final/i}}},
        {$not: {inline: 'Yes'}},
        {$not: {relist: true}},
        {$not: {remove: true}},
        {invLocation: 'AUCTION'},
        {receiptDate: {$exists: false}},
        {description: {$exists: true}}
      ]  
    }).sort({bin: 1});
    this.setState({
      lessNine: results
    })
  }

   async findAlerts() {
    let results = await inventorydb.find({
      $and: [
        {quantityAvailable: 0}, 
        {$not: {flag: {$regex: /briantest|absolute|recount/i}}},
        {$not: {bin: {$regex: /NA|office|dropship|- none -/i}}},
        {quantity: {$gt: 0}},
        {$not: {relist: true}},
        {$not: {remove: true}},
        {invLocation: 'AUCTION'},
        {receiptDate: {$exists: false}},
        {description: {$exists: true}},
        {$where: function() {return this.quantity > Math.max(this.committed, this.pendingShipment) * 2;}},
        {$where: function() {return this.quantity !== this.pendingCheckout + this.pendingPayment;}},

        //pending catch
        {$where: function() {return (this.quantity < 6 && this.quantity >= this.pendingCheckout + this.pendingPayment + Math.max(this.committed, this.pendingShipment) + 1) 
          || (this.quantity > 5 && this.quantity >= this.pendingCheckout + this.pendingPayment + Math.max(this.committed, this.pendingShipment) + 2);}}

      ]
    }).sort({bin: 1});
    this.setState({
      alerts: results
    })
  }

  async findDelist() {
    let results = await inventorydb.find({
      $and: [
        {quantityAvailable: {$lte: 0}}, 
        {$not: {flag: {$regex: /briantest|absolute|recount/i}}},
        {$not: {bin: {$regex: /NA|office|dropship|- none -/i}}},
        {$not: {relist: true}},
        {$not: {remove: true}},
        {invLocation: 'AUCTION'},
        {description: {$exists: true}},
        {$where: function() {return this.committed === this.quantity;}}
      ]
    }).sort({bin: 1});
    this.setState({
      delist: results
    })
  }

  async findRelist(flagDate) {
    let databaseQuery = await inventorydb.find({}).sort({bin: 1});
    let relistResults = await databaseQuery.filter((item) => {
      return (
        (item.relist === true && item.quantityAvailable === 0 && item.committed === 0 &&
          item.pendingCheckout === 0 && item.pendingPayment === 0 && item.pendingShipment === 0) ||
        (item.flag.indexOf('recount ' + flagDate) !== -1 && item.quantityAvailable === 0 && item.committed === 0 &&
          item.pendingCheckout === 0 && item.pendingPayment === 0 && item.pendingShipment === 0)
      );
    });
    let pushedResults = await databaseQuery.filter((item) => {
      return (
        (item.relist === true && (item.quantityAvailable !== 0 || item.committed !== 0 ||
          item.pendingCheckout !== 0 || item.pendingPayment !== 0 || item.pendingShipment !== 0)) ||
        (item.flag.indexOf('recount ' + flagDate) !== -1 && (item.quantityAvailable !== 0 || item.committed !== 0 ||
          item.pendingCheckout !== 0 || item.pendingPayment !== 0 || item.pendingShipment !== 0))
      );
    });
    let negativeResults = await databaseQuery.filter((item) => {
      return (
        item.quantityAvailable < 0
      );
    })
    this.setState({
      relist: relistResults,
      relistPushed: pushedResults,
      negatives: negativeResults
    })
  }

  async componentDidMount() {
    let today = new Date();
    let flagDate = (today.getMonth() + 1) + '/' + today.getDate();;

    await this.findRelist(flagDate);
    await this.findLessNine();
    await this.findAlerts();
    await this.findDelist();
    await this.setState({isLoading: !this.state.isLoading})
    console.log(this.state)
  }

  componentWillUnmount() {
    this.setState({
      lessNine: [],
      alerts: [],
      delist: [],
      relist: [],
      relistPushed: [],
      negatives: [],
      isLoading: true
    })
  }
  
  render() {
    return (
    <div>
    <Workbook filename='files.xlsx' element={<button className='download-btn'>
      {(this.state.isLoading) ? <span>Loading Reports</span> : <span style={{color: '#61efa7'}}>Download Reports</span>}
      </button>}>
      <Workbook.Sheet data={this.state.lessNine} name='Less9'>
      <Workbook.Column label='Sku' value='sku' />
      <Workbook.Column label='Description' value='description'/>
      <Workbook.Column label='Total' value={row => row.quantityAvailable + row.pendingCheckout + row.pendingPayment + row.pendingShipment} />
      <Workbook.Column label='Available' value='quantityAvailable'/>
      <Workbook.Column label='Pending' value={row => (row.pendingCheckout + row.pendingPayment)} />
      <Workbook.Column label='Committed' value={row => Math.max(row.committed, row.pendingShipment)} />
      <Workbook.Column label='Bin' value='bin'/>
      <Workbook.Column label='Backstock' value='backStock'/>
      <Workbook.Column label='UPC' value='upc'/>
      <Workbook.Column label='Stock' value='quantity'/>
      </Workbook.Sheet>
      <Workbook.Sheet data={this.state.alerts} name='Alerts'>
        <Workbook.Column label='Sku' value='sku' />
        <Workbook.Column label='Description' value='description'/>
        <Workbook.Column label='Total' value={row => row.quantityAvailable + row.pendingCheckout + row.pendingPayment + row.pendingShipment} />
        <Workbook.Column label='Available' value='quantityAvailable'/>
        <Workbook.Column label='Pending' value={row => (row.pendingCheckout + row.pendingPayment)} />
        <Workbook.Column label='Committed' value={row => Math.max(row.committed, row.pendingShipment)} />
        <Workbook.Column label='Bin' value='bin'/>
        <Workbook.Column label='Backstock' value='backStock'/>
        <Workbook.Column label='UPC' value='upc'/>
        <Workbook.Column label='Stock' value='quantity'/>
        <Workbook.Column label='Inline' value='inline'/>
      </Workbook.Sheet>
      <Workbook.Sheet data={this.state.delist} name='Delist'>
        <Workbook.Column label='Sku' value='sku' />
        <Workbook.Column label='Description' value='description'/>
        <Workbook.Column label='NS Qty' value={row => row.quantity - row.committed} />
        <Workbook.Column label='Inline' value='inline'/>
      </Workbook.Sheet>
      <Workbook.Sheet data={this.state.relist} name='Relist'>
        <Workbook.Column label='Sku' value='sku' />
        <Workbook.Column label='Description' value='description'/>
        <Workbook.Column label='Bin' value='bin'/>
        <Workbook.Column label='Backstock' value='backStock'/>
        <Workbook.Column label='UPC' value='upc'/>
        <Workbook.Column label='Stock' value='quantity'/>
        <Workbook.Column label='Inline' value='inline'/>
        <Workbook.Column label='Flag' value='flag'/>
        <Workbook.Column label='location' value='invLocation'/>
      </Workbook.Sheet>
      <Workbook.Sheet data={this.state.relistPushed} name='RelistToPush'>
        <Workbook.Column label='Sku' value='sku' />
        <Workbook.Column label='Description' value='description'/>
        <Workbook.Column label='Total' value={row => row.quantityAvailable + row.pendingCheckout + row.pendingPayment + row.pendingShipment} />
        <Workbook.Column label='Available' value='quantityAvailable'/>
        <Workbook.Column label='Pending' value={row => (row.pendingCheckout + row.pendingPayment)} />
        <Workbook.Column label='PendingShipment' value='pendingShipment'/>
        <Workbook.Column label='Committed' value='committed'/>
        <Workbook.Column label='Bin' value='bin'/>
        <Workbook.Column label='Backstock' value='backStock'/>
        <Workbook.Column label='UPC' value='upc'/>
        <Workbook.Column label='Stock' value='quantity'/>
        <Workbook.Column label='Inline' value='inline'/>
        <Workbook.Column label='Flag' value='flag'/>
        <Workbook.Column label='location' value='invLocation'/>
        </Workbook.Sheet>
        <Workbook.Sheet data={this.state.negatives} name='NegativeAvailable'>
          <Workbook.Column label='Sku' value='sku' />
          <Workbook.Column label='Description' value='description'/>
          <Workbook.Column label='Available' value='quantityAvailable'/>
        </Workbook.Sheet>
      </Workbook>  
      </div>  
    );
  }
}

const styles = {

  reportButton: {
    height: 36,
    borderRadius: 2,
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 10,
    border: '1px solid rgba(0, 0, 0, 0.4)',
    borderRadius: 4,
    bottomBorderColor: '1px solid rgba(0, 0, 0, 0.5)',
    boxShadow: '0 5px 12px -2px rgba(0, 0, 0, 0.3)'
  },
  btnSpan: {
    position: 'relative',
    opacity: 1,
    fontSize: 14,
    letterSpacing: 0,
    textTransform: 'uppercase',
    fontWeight: 500,
    margin: 0,
    userSelect: 'none',
    paddingLeft: 16,
    paddingRight: 16,
    color: '#fff',
    fontFamily: 'Open Sans, Arial, sans-serif'
  }
}