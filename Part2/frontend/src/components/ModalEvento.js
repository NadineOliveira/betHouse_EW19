import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Form,Field,formManager} from 'react-vio-form'
import {registaAposta} from '../actions/apostas'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ModalEvento extends React.Component {
    constructor(props) {
        super(...props);
        this.state = {value: ''};
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
            <h4>Equipa Casa: {this.props.evento.equipa1}</h4>
            <h4>Equipa Visitante: {this.props.evento.equipa2}</h4>
            <h4>Odd 1: {this.props.evento.odd1}</h4>
            <h4>Odd x: {this.props.evento.oddx}</h4>
            <h4>Odd 2: {this.props.evento.odd2}</h4>
            <h4>Data: {this.props.evento.data}</h4>
            <h4>Hora: {this.props.evento.hora}</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
  
ModalEvento.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export  default connect(mapStateToProps, {})(ModalEvento)