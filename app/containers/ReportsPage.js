import React, { Component } from 'react';
import { Link } from 'react-router-dom';


import { nsdb, cadb, receiptdb, relistdb, removesdb } from '../database';

export default class ReportsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  //find <9
  findLessNine(event) {
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
      console.log(item);
    });        
  }

  render() {
    return (
      <div>
        <div className="links">
          <Link to="/">Home</Link>
          <br />
          <Link to="/upload">Back to Uploads</Link>
        </div>
        Reports
        <div>
          <button onClick={(event) => this.findLessNine()}>Less9</button>
        </div>
      </div>
    );
  }
}