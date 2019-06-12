import React, { Component } from 'react';
import '../App.css';
import Table from '../components/Table.js'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import axios from 'axios';


var data = [
    {id: 1, data:'2019-11-11', prognostico: 'Porto', valor: 3},
    {id: 1, data:'2019-11-11', prognostico: 'Benfica', valor: 2},
    {id: 1, data:'2019-11-11', prognostico: 'Braga', valor: 6}
];
/*{id: 1, data:'2019-11-11', prognostico: 'Porto', valor: 3},
  {id: 1, data:'2019-11-11', prognostico: 'Benfica', valor: 2},
  {id: 1, data:'2019-11-11', prognostico: 'Braga', valor: 6},

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

function isLoggedIn() {
  if (localStorage.getItem('jwtToken')){
    return true
  }
  else
  return false
}


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