import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import { withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Navbar, NavItem, NavDropdown, MenuItem  } from 'react-bootstrap';
import {getSaldo} from '../actions/utilizador';
import ModalAddSaldo from './ModalAddSaldo';
import ModalRetiraSaldo from './ModelRetirarSaldo';
import ModalSaldo from './ModalSaldo';

class MyNavbar extends Component {
    constructor(props) {
        super(...props);
        this.state = {saldo: '',
                     modalShow: false,
                     modalShowL: false,
                     modalShowS: false
                    };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
        this.handleSaldo = this.handleSaldo.bind(this);
      }

    async componentDidMount(){
        const {isAuthenticated, user} = this.props.auth;
        if(isAuthenticated){
            var s = await getSaldo(user.email);
            this.setState({saldo: s})
        }
    }


    async handleSaldo(event,user,isAuthenticated) {
        if(isAuthenticated){
            var s = await getSaldo(user.email);
            this.setState({saldo: s})
        }
        event.preventDefault();
        this.setState({ modalShowS: true });
    }


    handleSubmit(event) {
        event.preventDefault();
        this.setState({ modalShow: true });
    }

    handleSubmit2(event) {
        //alert('Equipa Selecionada: ' + JSON.stringify(row));
        event.preventDefault();
        this.setState({ modalShowL: true });
    }

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    welcome (isAuthenticated,user) {
        if(isAuthenticated && user.premium && !user.admin)
            return (<span style={{fontSize: 18, color: "white", marginLeft: "2.5cm"}}>{`★ ${user.email} ★`}</span>)
        else if(isAuthenticated && user.admin)
            return (<span style={{fontSize: 18, color: "white", marginLeft: "2.5cm"}}>{`♛ ${user.email} ♛`}</span>)
        else  if(isAuthenticated)
            return (<span style={{fontSize: 18, color: "white", marginLeft: "2.5cm"}}>{`${user.email}`}</span>)
        else return null
    }

    render() {
        const {isAuthenticated, user} = this.props.auth;
        const authLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                {(!user.admin ? (
                    <NavDropdown title="Saldo" id="basic-nav-dropdown" >
                    <NavDropdown.Item onClick={event => this.handleSaldo(event,user,isAuthenticated)}>Ver Saldo</NavDropdown.Item>
                    <ModalSaldo
                    show={this.state.modalShowS}
                    saldo = {this.state.saldo}
                    history = {this.props.history}
                    onHide={() => this.setState({ modalShowS: false })}
                  />
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={event=>this.handleSubmit(event)}>Adicionar Saldo</NavDropdown.Item>
                    <ModalAddSaldo
                    show={this.state.modalShow}
                    email = {user.email}
                    history = {this.props.history}
                    onHide={() => this.setState({ modalShow: false })}
                  />
                    <NavDropdown.Item onClick={event=>this.handleSubmit2(event)}>Efetuar levantamento</NavDropdown.Item>
                    <ModalRetiraSaldo
                    show={this.state.modalShowL}
                    email = {user.email}
                    history = {this.props.history}
                    onHide={() => this.setState({ modalShowL: false })}
                  />
                </NavDropdown>)
                : null)}
                </li>
                <li className="nav-item">
                    {(user.admin ? <Button style={{marginRight: "0.1cm"}} variant="dark" href="/utilizadores">Lista de Utilizadores</Button> : null)}
                </li>
                <li className="nav-item">
                    {(user.admin ? <Button style={{marginRight: "0.1cm"}} variant="dark" href="/AdminApostas">Lista de Apostas</Button> : null)}
                </li>
                <li className="nav-item">
                    {(!user.admin ? <Button style={{marginRight: "0.1cm"}} variant="dark" href="/apostas">Consultar Apostas</Button> : <Button variant="dark" href="/eventos/concluidos">Histórico Eventos</Button>)}
                </li>
                <Button href="" variant="dark" onClick={this.onLogout.bind(this)}>
                    Logout
                </Button>
                
            </ul>
        )
      const guestLinks = (
        <ul className="navbar-nav ml-auto">
            
            <li className="nav-item">
                <Button variant="dark" href="/register">Sign Up</Button>
            </li>
            <li className="nav-item">
                <Button variant="dark" href="/login">Sign In</Button>
            </li>
            
        </ul>
      )
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Button size="lg" variant="dark" href="/" >BetESS</Button>
                { this.welcome(isAuthenticated,user) }
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
        )
    }
}
MyNavbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(withRouter(MyNavbar));