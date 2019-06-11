import React, { Component } from 'react';
import '../App.css';
import Table from '../components/Table.js'
import ReactCollapsingTable from 'react-collapsing-table'
import ReactTable from 'react-table'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {ModalHeader, Title, Body, Footer} from "react-bootstrap/ModalHeader";
import MyVerticallyCenteredModal from './Modal';

/*
var data = [
  {id: 1, name: 'Gob', value: '2'},
  {id: 2, name: 'Buster', value: '5'},
  {id: 3, name: 'George Michael', value: '4'}
];

var rows = [
  { id: 1, firstName: 'Paul', lastName: 'Darragh', }
]
var columns = [
  { accessor: 'firstName', label: 'First Name', priorityLevel: 1, position: 1, minWidth: 150, },
  { accessor: 'lastName', label: 'Last Name', priorityLevel: 2, position: 2, minWidth: 150, },
]
export default class Home extends Component {
  render() {
    return (
      <div>
        <p className="Table-header">BetESS</p>
        <Table data={data}/>
      </div>
    );
  }
}
 
*/

const products = [ {id:"1",data: '2019-12-12T20:00',equipa1:"Porto",equipa2:"Benfica",odd1:1.2,oddx:3,odd2:2}];
const columns = [{
  dataField: 'data',
  text: 'Data'
}, {
  dataField: 'equipa1',
  text: 'Equipa'
}, {
  dataField: 'equipa2',
  text: 'Equipa'
}];




export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: "", show: false,modalShow: false, token: localStorage.getItem('jwtToken')};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleSubmit(event) {
    //alert('Equipa Selecionada: ' + this.state.value);
    event.preventDefault();
    this.setState({ modalShow: true });
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    
  const expandRow = {
    
    renderer: row => (
      
        <div>
        <p>{ `This Expand row is belong to rowKey ${row.data},${JSON.stringify(row)}` }</p>
        <p><b>{`${row.equipa1}:`}</b>{` ${row.odd1}`}</p>
        <p><b>{`Empate`}</b>{` ${row.odd1}`}</p>
        <p><b>{`${row.equipa2}:`}</b>{` ${row.odd2}`}</p>
        <form /*onSubmit={this.handleShow}*/>
        <label>
          Selecione a equipa: 
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="" selected disabled hidden>Selecione</option>
            <option value={`${row.equipa1}`}>{`${row.equipa1}`}</option>
            <option value={`Empate`}>Empate</option>
            <option value={`${row.equipa2}`}>{`${row.equipa2}`}</option>
          </select>
        </label>
        <Button variant="outline-dark" onClick={this.handleSubmit}>Apostar</Button>
        <MyVerticallyCenteredModal
          show={this.state.modalShow}
          equipa = {this.state.value}
          onHide={() => this.setState({ modalShow: false })}
        />

        </form>
          
      </div>
    )
  };

    return (
      <div>
        <h1 class="text-center">BetESS</h1>
        <p>`${this.state.token}`</p>
      <BootstrapTable keyField='id' data={ products } columns={ columns } expandRow={ expandRow }/>
      
      </div>
      
    );
  }
}