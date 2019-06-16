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
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Evento
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{this.props.evento.equipa1} vs {this.props.evento.equipa2}</h4>
            <h4>{this.props.evento.data} <span style={{marginLeft: "1.5cm"}}>{this.props.evento.hora}</span></h4>
            <h4><span>Odd 1</span><span style={{marginLeft:"0.7cm"}}>Odd x</span><span style={{marginLeft:"0.7cm"}}>Odd 2</span></h4>
            <h4><span>{this.props.evento.odd1}</span><span style={{marginLeft:"2.4cm"}}>{this.props.evento.oddx}</span><span style={{marginLeft:"2.3cm"}}>{this.props.evento.odd2}</span></h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={this.props.onHide}>Fechar</Button>
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