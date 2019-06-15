import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Form,Field,formManager} from 'react-vio-form'
import {adicionaEvento} from '../actions/eventos'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ModalEventos extends React.Component {
    constructor(props) {
        super(...props);
        this.state = {data: '',hour: '',odd1: 0, odd2: 0, oddx: 0, equipa1: '', equipa2: '',premium: false};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleHourChange = this.handleHourChange.bind(this);
        this.handleCasaChange = this.handleCasaChange.bind(this);
        this.handleVisitanteChange = this.handleVisitanteChange.bind(this);
        this.handleOdd1Change = this.handleOdd1Change.bind(this);
        this.handleOdd2Change = this.handleOdd2Change.bind(this);
        this.handleOddxChange = this.handleOddxChange.bind(this);
        this.handlePremiumChange = this.handlePremiumChange.bind(this);
      }
      handleSubmit(event) {
        adicionaEvento(this.state.equipa1, this.state.equipa2, this.state.odd1, this.state.odd2, this.state.oddx, this.state.data, this.state.hour, this.state.premium)
        event.preventDefault()
      }
      handleDataChange(e) {          
        this.setState({
            data: e.target.value
        })
      }
      handleHourChange(e) {          
        this.setState({
            hour: e.target.value
        })
      }
      handleCasaChange(e) {        
        this.setState({
            equipa1: e.target.value
        })
      }
      handleVisitanteChange(e) {          
        this.setState({
            equipa2: e.target.value
        })
      }
      handleOdd1Change(e) {          
        this.setState({
            odd1: e.target.value
        })
      }
      handleOdd2Change(e) {          
        this.setState({
            odd2: e.target.value
        })
      }
      handleOddxChange(e) {          
        this.setState({
            oddx: e.target.value
        })
      }
      handlePremiumChange(e) {          
        this.setState({
            premium: !this.state.premium
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
              Adicionar Evento: { ``}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Data:</h4>
            <form >
                <div className="form-group">
                    <input
                    value={ this.state.data }
                    type="date"
                    label="Data do Jogo"
                    onChange={ this.handleDataChange }
                    />
                </div>
            </form>

            <h4>Hora:</h4>
            <form >
                <div className="form-group">
                    <input
                    value={ this.state.hour }
                    type="time"
                    label="Hora de Início"
                    defaultValue="07:30"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                    onChange={ this.handleHourChange }
                    />
                </div>
            </form>
            <h4>Equipa Casa:</h4>
            <form >
                <div className="form-group">
                    <input
                    value={ this.state.equipa1 }
                    type="text"
                    placeholder="Equipa Casa"
                    name="equipa1"
                    onChange={ this.handleCasaChange }
                    />
                </div>
            </form>
            <h4>Equipa Visitante:</h4>
            <form >
                <div className="form-group">
                    <input
                    value={ this.state.equipa2 }
                    type="text"
                    placeholder="Equipa Visitante"
                    name="equipa2"
                    onChange={ this.handleVisitanteChange }
                    />
                </div>
            </form>
            <h4>Odd Vitória:</h4>
            <form >
                <div className="form-group">
                    <input
                    value={ this.state.odd1 }
                    type="number"
                    placeholder="Vitoria"
                    name="odd1"
                    onChange={ this.handleOdd1Change }
                    />
                </div>
            </form>
            <h4>Odd Derrota:</h4>
            <form >
                <div className="form-group">
                    <input
                    value={ this.state.odd2 }
                    type="number"
                    placeholder="Derrota"
                    name="odd2"
                    onChange={ this.handleOdd2Change }
                    />
                </div>
            </form>
            <h4>Odd Empate:</h4>
            <form >
                <div className="form-group">
                    <input
                    value={ this.state.oddx }
                    type="number"
                    placeholder="Empate"
                    name="oddx"
                    onChange={ this.handleOddxChange }
                    />
                </div>
            </form>
            <h4>Premium:</h4>
            <form >
                <div className="form-group">
                <input
                  name="premium"
                  type="checkbox"
                  checked={this.state.premium}
                  onChange={this.handlePremiumChange} />
                </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={event=>this.handleSubmit(event)}>Criar</Button>
            <Button variant="outline-dark" onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
  
  ModalEventos.propTypes = {
    adicionaEvento: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export  default connect(mapStateToProps, {adicionaEvento})(ModalEventos)