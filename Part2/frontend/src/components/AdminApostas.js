  import React, { Component } from 'react';
import '../App.css';
import Table from './Table.js'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import axios from 'axios';  
import {BootstrapTable, 
       TableHeaderColumn} from 'react-bootstrap-table';
import ModalEvento from './ModalEvento';



export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: "", 
                  token: localStorage.getItem('jwtToken'),
                  modalShow: false,
                  modal2Show: false,
                  apostas: [],
                  evento: {},
                  user: {}
                };
    axios.get('http://localhost/apostas/total').then(response => {
      this.setState({apostas: response.data})
    })
  }
  
  onClickProductSelected(cell, row, rowIndex){
    axios.get('http://localhost/eventos/'+row.evento)
      .then(res => {
        this.setState({evento: res.data, modalShow: true})
      })
  }
 
 cellButton(cell, row, enumObject, rowIndex) {
   return (
      <button 
         type="button" 
         onClick={() => 
         this.onClickProductSelected(cell, row, rowIndex)}
      >
      Detalhes
      </button>
   )
 }

  render() {

    return (
      <div>
        <h1 style={{marginTop: "1cm" }}>Lista de Apostas</h1>
        <BootstrapTable 
          striped
          data={this.state.apostas} 
          headerStyle={ { background: '#616161', WebkitTextFillColor: '#FFFFFF' }}
          bodyStyle={ { background: '#EEEEEE' } }
          search
          pagination
        >
          <TableHeaderColumn isKey dataField='_id'>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn dataSort dataField='data'>
            Data
          </TableHeaderColumn>
          <TableHeaderColumn dataField='prognostico'>
            Prognostico
          </TableHeaderColumn>
          <TableHeaderColumn dataSort dataField='valor'>
            Valor
          </TableHeaderColumn>
          <TableHeaderColumn dataField='user'>
            User
          </TableHeaderColumn>
          <TableHeaderColumn dataField='evento' dataFormat={this.cellButton.bind(this)}>
            Evento
          </TableHeaderColumn>
        </BootstrapTable>
        <ModalEvento
            show={this.state.modalShow}
            evento = {this.state.evento}
            onHide={() => this.setState({ modalShow: false })}
        />

      </div>
      
    );
  }
}