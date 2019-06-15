import React, { Component } from 'react';
import {BootstrapTable, 
       TableHeaderColumn} from 'react-bootstrap-table';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'


 
 
class Table1 extends Component {
  render() {
    return (
      <div>
        <BootstrapTable data={this.props.data}
          striped
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
          <TableHeaderColumn dataField='equipa1'>
            Equipa 1
          </TableHeaderColumn>
          <TableHeaderColumn dataField='equipa2'>
            Equipa 2
          </TableHeaderColumn>
          <TableHeaderColumn dataField='resultado'>
            Resultado
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
 
export default Table1;  