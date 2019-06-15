import React, { Component } from 'react';
import '../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Button from 'react-bootstrap/Button';
import MyVerticallyCenteredModal from './ModalAposta';
import MyVerticallyCenteredModalEventos from './ModalEventos';
import {encerraEvento} from '../actions/eventos'
import axios from 'axios';
import paginationFactory from 'react-bootstrap-table2-paginator';
import PropTypes from 'prop-types';


const products = [];

//const products = [ {_id:"5d0045df5355770012aabd12",data: '2019-12-12',equipa1:"Porto",equipa2:"Benfica",odd1:1.2,oddx:3,odd2:2}];
const columns = [{
  dataField: 'data',
  text: 'Data',
  
}, {
  dataField: 'equipa1',
  text: 'Equipa',
}, {
  dataField: 'equipa2',
  text: 'Equipa',
}];

function isLoggedIn() {
  if (localStorage.getItem('jwtToken')){
    return true
  }
  else
  return false
}


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "blue",
      value: "",
      value2: "", 
      show: false,
      modalShow: false, 
      token: localStorage.getItem('jwtToken'), 
      premium: localStorage.getItem('premium'), 
      admin: localStorage.getItem('admin'), 
      products: []
    };
    
    this.aposta = {data: "", valor: "", prognostico: "", evento: ""}
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEncerrar = this.handleEncerrar.bind(this);
  }
  componentWillMount(){
      axios.get('http://localhost/eventos').then(response => {
        this.setState({products: response.data})
    })
    //alert(this.state.products)
  }
  handleSubmit(row,event) {
    //alert('Equipa Selecionada: ' + JSON.stringify(row));
    event.preventDefault();
    this.setState({ modalShow: true });
  }
  handleEncerrar(row,equipa,result,event) {
    //alert('Equipa Selecionada: ' + JSON.stringify(row));
    //encerrarEvento
    event.preventDefault();
    encerraEvento(row._id,equipa.split("-")[1],result)
    this.setState({ value: ""})
  }
  handleAdicionar(event) {
    //alert('Equipa Selecionada: ' + JSON.stringify(row));
    //encerrarEvento
    event.preventDefault();

    this.setState({ modalShow: true });
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleChange2(event) {
    this.setState({value2: event.target.value});
  }
  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }


  eventosCondition = () => {
    if(this.state.token && (this.state.admin === "true")) {
      return (<form>
        <Button variant="outline-dark" onClick={event=>this.handleAdicionar(event)}>Adicionar Evento</Button>
        <MyVerticallyCenteredModalEventos
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
        />
      </form>)
    } else return null 
  }

  buttonCondition = (row) => {
    if(this.state.token) {
      if(this.state.admin === "true")
        return (<div>
                  <label style={{marginRight: "1cm"}}>
                    Selecione a equipa Vencedora e insira resultado: 
                    <select value={this.state.value} onChange={this.handleChange}>
                      <option value="" selected disabled hidden>Selecione</option>
                      <option value={`${row.equipa1}-1`}>{`${row.equipa1} `}</option>
                      <option value={`Empate-2`}>Empate</option>
                      <option value={`${row.equipa2}-3`}>{`${row.equipa2}`}</option>
                    </select>
                    <input 
                      value={ this.state.value2 }
                      type="text"
                      placeholder="0-3"
                      onChange={ this.handleChange2 }
                    />
                  </label>
                  <Button variant="outline-dark" onClick={event=>this.handleEncerrar(row,this.state.value,this.state.value2,event)}>Fechar Evento</Button>
                </div>)
      else 
        return (<div>
                  <label>
                    Selecione a equipa: 
                    <select value={this.state.value} onChange={this.handleChange}>
                      <option value="" selected disabled hidden>Selecione</option>
                      <option value={`${row.equipa1}-1`}>{`${row.equipa1} `}</option>
                      <option value={`Empate-2`}>Empate</option>
                      <option value={`${row.equipa2}-3`}>{`${row.equipa2}`}</option>
                    </select>
                  </label>
                  <Button variant="outline-dark" onClick={event=>this.handleSubmit(row,event)}>Apostar</Button>
                  <MyVerticallyCenteredModal
                    show={this.state.modalShow}
                    equipa = {this.state.value}
                    row = {row}
                    onHide={() => this.setState({ modalShow: false })}
                  />
                </div>)
    } else return null
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
            <div>{this.buttonCondition(row)}</div>

          </form>
            
        </div>
      )
    };

    return (
      <div style={{margin: '0.5cm'}} className="application" >
        <h1 class="text-center"> </h1>
        <h1 class="text-center">BetESS </h1>
        <p>{this.state.token} </p>
        <BootstrapTable keyField='id' data={ this.state.products } columns={ columns } expandRow={ expandRow }
                              pagination={ paginationFactory() } bordered={false}/>
        <div>{ this.eventosCondition() }</div>
      </div>
      
    );
  }
}

export default Home;