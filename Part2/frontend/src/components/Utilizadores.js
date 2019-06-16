import React, { Component } from 'react';
import '../App.css';
import Table from './Table.js'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import axios from 'axios';  
import {BootstrapTable, 
       TableHeaderColumn} from 'react-bootstrap-table';
import ModalAddSaldo from './ModalAddSaldo';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: "", 
                  modalShow: false,
                  token: localStorage.getItem('jwtToken'),
                  utilizadores: []
                };
    axios.get('http://localhost/utilizadores').then(response => {
      this.setState({utilizadores: response.data})
    })
  }

  changePremium(row){
    axios.post('http://localhost/utilizadores/premium/',{premium: !row.premium, email: row.email})
      .then(res => {
        alert("Alteração de utilizador concluida")
      })
      .catch(() => alert("Erro na alteração de utilizador"))
  }
  toAdmin(row){
    axios.post('http://localhost/utilizadores/admin/',{admin: true, email: row.email})
      .then(res => {
        alert("Alteração de utilizador concluida")
      })
      .catch(() => alert("Erro na alteração de utilizador"))
  }

  cellButton(cell, row, enumObject, rowIndex) {
    return (<div>
       <button style={{margin: "0.05cm"}}
          type="button" 
          onClick={() => this.setState({value: row.email, modalShow: true})}
       >
       Valor
       </button>
       <button style={{margin: "0.05cm"}}
          type="button" 
          onClick={() => this.changePremium(row) }
       >
       Premium
       </button>
       {!row.admin ? <button style={{margin: "0.05cm"}}
                      type="button" 
                      onClick={() => this.toAdmin(row) }
                     >
                      Admin
                     </button> : null}
       </div>
    )
  }
  
  render() {

    return (
      <div>
        <h1 style={{marginTop: "1cm" }}>Lista de Utilizadores</h1>
        <BootstrapTable 
          striped
          data={this.state.utilizadores} 
          headerStyle={ { background: '#616161', WebkitTextFillColor: '#FFFFFF' }}
          bodyStyle={ { background: '#EEEEEE' } }
          search
          pagination
        >
          <TableHeaderColumn isKey dataSort dataField='email'>
            Email
          </TableHeaderColumn>
          <TableHeaderColumn dataSort dataField='saldo'>
            Saldo
          </TableHeaderColumn>
          <TableHeaderColumn dataField='premium'>
            Premium
          </TableHeaderColumn>
          <TableHeaderColumn dataField='admin'>
            Admin
          </TableHeaderColumn>
          <TableHeaderColumn dataField='email' dataFormat={this.cellButton.bind(this)}>
            Editar
          </TableHeaderColumn>
        </BootstrapTable>
        <ModalAddSaldo
          show={this.state.modalShow}
          email = {this.state.value}
          onHide={() => this.setState({ modalShow: false })}
        />
      </div>
      
    );
  }
}