import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Form,Field,formManager} from 'react-vio-form'
import {registaAposta} from '../actions/apostas'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class MyVerticallyCenteredModal extends React.Component {
    constructor(props) {
        super(...props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
      }
      handleSubmit(event,row,prog) {
        //alert('Valor Apostado: '+ this.state.value + JSON.stringify(row));
        this.props.registaAposta(row,this.state.value,prog)
        event.preventDefault()
      }
      handleInputChange(e) {          
        this.setState({
            value: e.target.value
        })
      }
    render() {
      return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Evento
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Equipa Casa: {this.state.evento.equipa1}</h4>
            <h4>Equipa Visitante: {this.state.evento.equipa2}</h4>
            <h4>Odd 1: {this.state.evento.odd1}</h4>
            <h4>Odd x: {this.state.evento.oddx}</h4>
            <h4>Odd 2: {this.state.evento.odd2}</h4>
            <h4>Data: {this.state.evento.data}</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
  
MyVerticallyCenteredModal.propTypes = {
    evento: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
  evento: state.evento,
  auth: state.auth,
  errors: state.errors
})

export  default connect(mapStateToProps, { })(MyVerticallyCenteredModal)