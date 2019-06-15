import React, { Component } from 'react';
import '../App.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Button from 'react-bootstrap/Button';
import ModalAposta from './ModalAposta';
import ModalEventos from './ModalEventos';
import {encerraEvento} from '../actions/eventos'
import axios from 'axios';


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
      eventos: [],
      eventosConcluir: []
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
        this.setState({eventos: response.data})
    })
    axios.get('http://localhost/eventos/porConcluir').then(response => {
        this.setState({eventosConcluir: response.data})
    })
    //alert(this.state.eventos)
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

  concluirEventos = () => {
    if(this.state.token && (this.state.admin === "true")) {
      return (
        <div>
          <h2 style={{marginTop: "1cm" }}>Eventos Para Concluir </h2>
          <BootstrapTable data={ this.state.eventosConcluir }
            striped
            expandableRow={ this.isExpandableRow }
            expandComponent={row=> this.expandComponent(row) }
            headerStyle={ { background: '#616161', WebkitTextFillColor: '#FFFFFF' }}
            bodyStyle={ { background: '#EEEEEE' } }
            search
            pagination
          >
            <TableHeaderColumn dataField='_id' hidden isKey></TableHeaderColumn>
            <TableHeaderColumn dataSort dataField='data'>Data</TableHeaderColumn>
            <TableHeaderColumn dataSort dataField='hora'>Hora</TableHeaderColumn>
            <TableHeaderColumn dataField='equipa1'>Equipa 1</TableHeaderColumn>
            <TableHeaderColumn dataField='equipa2'>Equipa 2</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    }
  }

  eventosCondition = () => {
    if(this.state.token && (this.state.admin === "true")) {
      return (<form>
        <Button variant="outline-dark" onClick={event=>this.handleAdicionar(event)}>Adicionar Evento</Button>
        <ModalEventos
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
        />
      </form>)
    } else return null 
  }

  buttonCondition = (row) => {
    if(this.state.token) {
      if(this.state.admin === "true")
        return (<form>
                  <div>
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
                </div></form>)
      else 
        return (<form><div>
                  <label>
                    <p>Selecione a equipa:
                    <span style={{marginLeft: "0.3cm"}}><select value={this.state.value} onChange={this.handleChange}>
                      <option value="" selected disabled hidden>Selecione</option>
                      <option value={`${row.equipa1}-1`}>{`${row.equipa1} `}</option>
                      <option value={`Empate-2`}>Empate</option>
                      <option value={`${row.equipa2}-3`}>{`${row.equipa2}`}</option>
                    </select></span></p>
                  </label>
                  <Button style={{marginLeft: "2cm"}} variant="outline-dark" onClick={event=>this.handleSubmit(row,event)}><b>Apostar</b></Button>
                  <ModalAposta
                    show={this.state.modalShow}
                    equipa = {this.state.value}
                    row = {row}
                    onHide={() => this.setState({ modalShow: false })}
                  />
                </div></form>)
    } else return null
  }
  
  isExpandableRow(row) {
    return true;
  }

  expandComponent(row) {
    return (
      <div>
          <p style={{margin: "0.3cm"}}><b>Lista de Odds:</b></p>
          <p>
            <span style={{margin: "0.5cm"}}><b>{`${row.equipa1}:`}</b>{` ${row.odd1}`}</span>
            <span style={{margin: "0.5cm"}}><b>{`Empate`}</b>{` ${row.odd1}`}</span>
            <span style={{margin: "0.5cm"}}><b>{`${row.equipa2}:`}</b>{` ${row.odd2}`}</span>
          </p>
          
            <div>{this.buttonCondition(row)}</div>
            
        </div>
    );
  }

  render() {
    return (
      <div style={{margin: '0.5cm'}} className="application" >
        <h1 style={{marginTop: "1cm" }}>Eventos </h1>
        <div>{ this.eventosCondition() }</div>
        <BootstrapTable data={ this.state.eventos }
          striped
          expandableRow={ this.isExpandableRow }
          expandComponent={row=> this.expandComponent(row) }
          headerStyle={ { background: '#616161', WebkitTextFillColor: '#FFFFFF' }}
          bodyStyle={ { background: '#EEEEEE' } }
          search
          pagination
        >
          <TableHeaderColumn dataField='_id' hidden isKey></TableHeaderColumn>
          <TableHeaderColumn dataSort dataField='data'>Data</TableHeaderColumn>
          <TableHeaderColumn dataSort dataField='hora'>Hora</TableHeaderColumn>
          <TableHeaderColumn dataField='equipa1'>Equipa 1</TableHeaderColumn>
          <TableHeaderColumn dataField='equipa2'>Equipa 2</TableHeaderColumn>
        </BootstrapTable>

        {this.concluirEventos()}
      </div>

      
    );
  }
}

export default Home;