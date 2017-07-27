import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Workbook from 'react-excel-workbook';


import { inventorydb } from '../database';

export default class ReportsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      lessNine: [],
      alerts: [],
      delist: [],
      relist: [],
      relistPushed: []
    }
    
  }

  async findLessNine() {
    let results = await inventorydb.find({
      quantityAvailable: {$lt: 10, $gt: 0}, 
      $not: {flag: {$regex: /briantest|inline|final/i}},
      $not: {relist: true},
      $not: {remove: true}
    });
    this.setState({
      lessNine: results
    })
  }

   async findAlerts() {
    let results = await inventorydb.find({
      quantityAvailable: 0, 
      $not: {flag: {$regex: /briantest|absolute|recount/i}},
      $not: {bin: {$regex: /NA|office|dropship|- none -/i}},
      quantity: {$gt: 0},
      $not: {relist: true},
      $not: {remove: true} 
    });
    this.setState({
      alerts: results
    })
  }



  // findDelist() {
  //   cadb.find({$not: {flag: {$regex: /briantest|absolute|recount/i} }}, (err, docs) => {
  //     let item = [];
  //     docs.forEach((doc) => {
  //       let completeSku = {};
  //       nsdb.find({sku: doc.sku, $not: {bin: {$regex: /na|- None -|office|dropship/i} }}, (err, res) => {
  //         if (res.length === 1) {
  //           completeSku = Object.assign(doc, ...res);
  //           removesdb.find({sku: doc.sku}, (err, res) => {
  //             if (res.length === 0) { //do not include in item array
  //               if (completeSku.hasOwnProperty('invLocation') && completeSku.quantity === completeSku.committed) {
  //                 item.push(completeSku);      
  //               } 
  //             } 
  //           });
  //         }
  //       });
  //     });
  //     this.setState({
  //       delist: item
  //     });
  //   });
  // }

  // findRelist() {
  //   let today = new Date();
  //   let dd = today.getDate();
  //   let mm = today.getMonth() + 1;  // January is 0
  //   let flagDate = mm + '/' + dd;
  //   console.log(`today is ${flagDate}`);
  //   let dateRegex = new RegExp('recount ' + flagDate, 'gi');

  //   let item = []
  //   cadb.find({flag: {$regex: dateRegex}, quantityAvailable: 0, pendingCheckout: 0, pendingPayment: 0, pendingShipment: 0 }, (err, docs) => {
  //     docs.forEach((doc) => {
  //       let completeSku = {};
  //       nsdb.find({sku: doc.sku, committed: 0}, (err, res) => {
  //         if (res.length === 1) {
  //           completeSku = Object.assign(doc, ...res);
  //           item.push(completeSku);
  //         }
  //       });
  //     });   
  //   });
  //   relistdb.find({}, (err, docs) => {
  //     docs.forEach((doc) => {
  //       let completeSku = {};
  //       nsdb.find({sku: doc.sku, committed: 0}, (err, res) => {
  //         if (res.length === 1) {
  //           completeSku = Object.assign(doc, ...res);
  //           cadb.find({sku: doc.sku, quantityAvailable: 0, pendingCheckout: 0, pendingPayment: 0, pendingShipment: 0}, (err, res) => {
  //             completeSku = Object.assign(doc, ...res);
  //             item.push(completeSku);
  //           });
  //         }
  //       });
  //     });
  //     this.setState({
  //       relist: item
  //     });   
  //   });           
  // }

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
               <Workbook.Column label="Total" value={row => row.quantityAvailable + row.pendingCheckout + row.pendingPayment + row.pendingShipment} />
               <Workbook.Column label="Available" value="quantityAvailable"/>
               <Workbook.Column label="Pending" value={row => (row.pendingCheckout + row.pendingPayment)} />
               <Workbook.Column label="Committed" value={row => Math.max(row.committed, row.pendingShipment)} />
               <Workbook.Column label="Bin" value="bin"/>
               <Workbook.Column label="Backstock" value="backStock"/>
              <Workbook.Column label="UPC" value="upc"/>
               <Workbook.Column label="Stock" value="quantity"/>
             </Workbook.Sheet>
             <Workbook.Sheet data={this.state.alerts} name="Alerts">
               <Workbook.Column label="Sku" value='sku' />
               <Workbook.Column label="Description" value="description"/>
               <Workbook.Column label="Total" value={row => row.quantityAvailable + row.pendingCheckout + row.pendingPayment + row.pendingShipment} />
               <Workbook.Column label="Available" value="quantityAvailable"/>
               <Workbook.Column label="Pending" value={row => (row.pendingCheckout + row.pendingPayment)} />
               <Workbook.Column label="Committed" value={row => Math.max(row.committed, row.pendingShipment)} />
               <Workbook.Column label="Bin" value="bin"/>
               <Workbook.Column label="Backstock" value="backStock"/>
               <Workbook.Column label="UPC" value="upc"/>
               <Workbook.Column label="Stock" value="quantity"/>
               <Workbook.Column label="Inline" value="inline"/>
             </Workbook.Sheet>
             <Workbook.Sheet data={this.state.delist} name="Delist">
               <Workbook.Column label="Sku" value='sku' />
               <Workbook.Column label="Description" value="description"/>
               <Workbook.Column label="NS Qty" value={row => row.quantity - row.committed} />
               <Workbook.Column label="Inline" value="inline"/>
             </Workbook.Sheet>
             <Workbook.Sheet data={this.state.relist} name="Relist">
               <Workbook.Column label="Sku" value='sku' />
               <Workbook.Column label="Description" value="description"/>
               <Workbook.Column label="Total" value={row => row.quantityAvailable + row.pendingCheckout + row.pendingPayment + row.pendingShipment} />
               <Workbook.Column label="Available" value="quantityAvailable"/>
               <Workbook.Column label="Pending" value={row => (row.pendingCheckout + row.pendingPayment)} />
               <Workbook.Column label="Committed" value={row => Math.max(row.committed, row.pendingShipment)} />
               <Workbook.Column label="Bin" value="bin"/>
               <Workbook.Column label="Backstock" value="backStock"/>
               <Workbook.Column label="UPC" value="upc"/>
               <Workbook.Column label="Stock" value="quantity"/>
               <Workbook.Column label="Inline" value="inline"/>
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