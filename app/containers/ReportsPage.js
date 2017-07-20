import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Workbook from 'react-excel-workbook';


import { nsdb, cadb, receiptdb, relistdb, removesdb } from '../database';

export default class ReportsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      lessNine: [],
      alerts: []
    }
  }



  //find <9
  findLessNine() {
    let item = []
    cadb.find({quantityAvailable: {$lt: 10, $gt: 0}, $not: {flag: {$regex: /briantest|inline|final/i} }}, (err, docs) => {
      docs.forEach((doc) => {
        let completeSku = {};
        nsdb.find({sku: doc.sku}, (err, res) => {
          if (res.length === 1) {
            completeSku = Object.assign(doc, ...res);
          }
        receiptdb.find({sku: doc.sku}, (err, res) => {
          if (res) {
            completeSku = Object.assign(doc, ...res);
          }
          if (!completeSku.hasOwnProperty('receiptDate'))
            item.push(completeSku);
          });
        });
        
      });
      this.setState({
        lessNine: item
      });
    });        
  }

  findAlerts() {
    let item = []
    cadb.find({quantityAvailable: 0, $not: {flag: {$regex: /briantest|absolute|recount/i} }}, (err, docs) => {
      docs.forEach((doc) => {
        let completeSku = {};
        nsdb.find({sku: doc.sku, quantity: {$gt: 0}, $not: {bin: {$regex: /NA|dropship|- none -/i} }}, (err, res) => {
          if (res.length === 1) {
            completeSku = Object.assign(doc, ...res);
            receiptdb.find({sku: doc.sku}, (err, res) => {
              if (res) {
                completeSku = Object.assign(doc, ...res);
              }
              if (!completeSku.hasOwnProperty('receiptDate') && completeSku.hasOwnProperty('invLocation')) {
                item.push(completeSku);
              }  
            });
          }
        });
      });
      this.setState({
        alerts: item
      });  
    });        
  }

  componentDidMount() {
    this.findLessNine();
    this.findAlerts();
  }

  render() {
    
    return (
      <div className='reports-container' style={styles.reportsContainer}>
        <div>
          <button onClick={() => console.log(this.state)}>State</button>
          <Workbook filename="files.xlsx" element={<button className="btn btn-lg btn-primary">Download</button>}>
            <Workbook.Sheet data={this.state.lessNine} name="Less9">
              <Workbook.Column label="Sku" value='sku' />
              <Workbook.Column label="Description" value="description"/>
              <Workbook.Column label="Total" value={row => row.quantityAvailable + row.pendingCheckout + row.pendingPayment + row.pendingShipment}/>
              <Workbook.Column label="Available" value="quantityAvailable"/>
              <Workbook.Column label="Pending" value={row => (row.pendingCheckout + row.pendingPayment)}/>
              <Workbook.Column label="Committed" value={row => Math.max(row.committed, row.pendingShipment)}/>
              <Workbook.Column label="Bin" value="bin"/>
              <Workbook.Column label="Backstock" value="backStock"/>
              <Workbook.Column label="UPC" value="upc"/>
              <Workbook.Column label="Stock" value="quantity"/>
            </Workbook.Sheet>
            <Workbook.Sheet data={this.state.alerts} name="Alerts">
              <Workbook.Column label="Sku" value='sku' />
              <Workbook.Column label="Description" value="description"/>
              <Workbook.Column label="Total" value={row => row.quantityAvailable + row.pendingCheckout + row.pendingPayment + row.pendingShipment}/>
              <Workbook.Column label="Available" value="quantityAvailable"/>
              <Workbook.Column label="Pending" value={row => (row.pendingCheckout + row.pendingPayment)}/>
              <Workbook.Column label="Committed" value={row => Math.max(row.committed, row.pendingShipment)}/>
              <Workbook.Column label="Bin" value="bin"/>
              <Workbook.Column label="Backstock" value="backStock"/>
              <Workbook.Column label="UPC" value="upc"/>
              <Workbook.Column label="Stock" value="quantity"/>
            </Workbook.Sheet>
          </Workbook>
        </div>
      </div>
    );
  }
}

const styles = {
  reportsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  reportButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 10,
    border: '1px solid rgba(0, 0, 0, 0.4)',
    borderRadius: 4,
    bottomBorderColor: '1px solid rgba(0, 0, 0, 0.5)',
    boxShadow: '0 5px 12px -2px rgba(0, 0, 0, 0.3)'
  }
}