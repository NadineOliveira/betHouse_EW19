import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {aumentaSaldo} from '../actions/utilizador';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


class ModalSaldo extends React.Component {
    constructor(props) {
        super(...props);
      }
    render() {
      return (
        <div>
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          background="black"
          dialogClassName="modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Saldo:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form >
                <div className="form-group">
                    <input
                    value = {this.props.saldo + " EUR"}
                    type="text"
                    placeholder="Valor"
                    name="valor"
                    disabled = {true}
                    />
                </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
        </div>
      );
    }
  }

  ModalSaldo .propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export  default connect(mapStateToProps, { aumentaSaldo })(ModalSaldo)