import React, { Component } from 'react';
import '../App.css';
import Table from './TableEventos.js'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import axios from 'axios';


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: "", 
                  token: localStorage.getItem('jwtToken'),
                  eventos: []
                };
    axios.get('http://localhost/eventos/concluidos').then(response => {
      alert(JSON.stringify(response.data))
      this.setState({eventos: response.data})
    })
  }

  render() {

    return (
      <div>
        <h1 class="text-center">Eventos</h1>
        <p className="Table-header"></p>
            <Table data={this.state.eventos}/>
      
      </div>
      
    );
  }
}