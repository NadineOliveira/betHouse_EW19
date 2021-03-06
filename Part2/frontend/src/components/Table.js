import React, { Component } from 'react';
import {BootstrapTable, 
       TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'
import axios from 'axios';
import ModalEvento from './ModalEvento';
 
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
        <BootstrapTable 
          striped
          data={this.props.data} 
          headerStyle={ { background: '#616161', WebkitTextFillColor: '#FFFFFF' }}
          bodyStyle={ { background: '#EEEEEE' } }
          search
          pagination
        >
          <TableHeaderColumn isKey dataField='_id'>
            ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField='data'>
            Data
          </TableHeaderColumn>
          <TableHeaderColumn dataField='prognostico'>
            Prognostico
          </TableHeaderColumn>
          <TableHeaderColumn dataSort dataField='valor'>
            Valor
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
 
export default Table1;  