import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {retiraSaldo} from '../actions/utilizador';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class ModalRetiraSaldo extends React.Component {
    constructor(props) {
        super(...props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
      }
      handleSubmit(event) {
        //alert('Valor Apostado: '+ this.state.value + JSON.stringify(row));
        retiraSaldo(this.props.email,this.state.value)
        this.props.onHide();
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
              Efetuar Levantamento:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Valor:</h4>
            <form >
                <div className="form-group">
                    <input
                    value={ this.state.value }
                    type="number"
                    placeholder="Valor"
                    name="valor"
                    onChange={ this.handleInputChange }
                    />
                </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={event=>this.handleSubmit(event)}>Confirmar</Button>
            <Button variant="outline-dark" onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }

  ModalRetiraSaldo .propTypes = {
    retiraSaldo: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export  default connect(mapStateToProps, { retiraSaldo})(ModalRetiraSaldo)