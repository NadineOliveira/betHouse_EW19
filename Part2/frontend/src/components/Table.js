import React, { Component } from 'react';
import {BootstrapTable, 
       TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import MyVerticallyCenteredModalEvento from './ModalEvento';
 
class Table1 extends Component {
  constructor(props) {
      super(props);
      this.state = {
        modalShow: false,
        evento: {}
      }
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
        <BootstrapTable data={this.props.data}>
          <TableHeaderColumn isKey dataField='_id'>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField='data'>
            Data
          </TableHeaderColumn>
          <TableHeaderColumn dataField='prognostico'>
            Prognostico
          </TableHeaderColumn>
          <TableHeaderColumn dataField='valor'>
            valor
          </TableHeaderColumn>
          <TableHeaderColumn dataField='recebido'>
            Concluido
          </TableHeaderColumn>
          <TableHeaderColumn dataField='evento' dataFormat={this.cellButton.bind(this)}>
            Evento
          </TableHeaderColumn>
        </BootstrapTable>
        <MyVerticallyCenteredModalEvento
                  show={this.state.modalShow}
                    evento = {this.state.evento}
                    onHide={() => this.setState({ modalShow: false })}
                  />
      </div>
    );
  }
}
 
export default Table1;  