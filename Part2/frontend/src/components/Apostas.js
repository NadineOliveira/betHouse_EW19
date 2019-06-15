import React, { Component } from 'react';
import '../App.css';
import Table from '../components/Table.js'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import axios from 'axios';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: "", 
                  token: localStorage.getItem('jwtToken'),
                  apostas: []
                };
    axios.get('http://localhost/apostas').then(response => {
      this.setState({apostas: response.data})
    })
  }

  render() {

    return (
      <div>
        <h1 class="text-center">Apostas</h1>
        <p className="Table-header"></p>
            <Table data={this.state.apostas}/>
      
      </div>
      
    );
  }
}