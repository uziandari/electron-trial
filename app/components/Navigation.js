import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';


export default class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      index: value,
    });
  };

  render() {
    return (
      <div className="navigation" style={styles.navContainer}>
        <MuiThemeProvider>
          <Tabs 
            value={this.state.value}
            onChange={this.handleChange}
            tabItemContainerStyle={styles.navbar}
            inkBarStyle={styles.inkBar}
          >
            <Tab label="Home" value={0} containerElement={<Link to="/"/>}>
            </Tab>
            <Tab label="Upload" value={1} containerElement={<Link to="/upload"/>}>
            </Tab>
            <Tab label="Reports" value={2} containerElement={<Link to="/reports"/>}>
            </Tab>
          </Tabs>
        </MuiThemeProvider>
      </div>
    );
  }
}

const styles = {
  navContainer: {
    margin: '0 0 20px 0'
  },
  navbar: {
    backgroundColor: '#00001a',
    color: 'white',
  },
  inkBar: {
    backgroundColor: '#A5D6A7',
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 30,
  }
};
