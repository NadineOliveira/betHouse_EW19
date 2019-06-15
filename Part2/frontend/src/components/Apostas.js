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
                  apostas: [],
                  apostasConcluidas: []
                };
    axios.get('http://localhost/apostas').then(response => {
      this.setState({apostas: response.data})
    })
    axios.get('http://localhost/apostas/recebidas').then(response => {
      this.setState({apostasConcluidas: response.data})
    })
  }

  render() {

    return (
      <div>
        <h1 style={{marginTop: "1cm" }}>Apostas</h1>
        <Table data={this.state.apostas}/>

        <h2 style={{marginTop: "2cm" }}>Apostas Concluidas</h2>
        <Table data={this.state.apostasConcluidas}/>
      </div>
      
    );
  }
}