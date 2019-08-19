import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import toastr from 'toastr';
import $ from "jquery";

import * as authActions from '../../redux/actions/auth.action';

import './Login.scss';

class Login extends React.Component {

    state = {
        username: '',
        password: ''
    };

    componentDidMount(): void {
        let usernameField = $('#username');
        usernameField.focus();
    }

    onSubmit = event => {
        event.preventDefault();
        this.props.actions.errorReset();

        axios.post('/v1/user/login', this.state)
            .then(response => {
                console.log(response);
                toastr.success('Login Successful!', 'Login User');

                this.props.actions.loginUser(response.data.success.token);
                this.props.history.push('/app/dashboard');
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error('The username and password combination is invalid!', 'Unauthorized');
                } else {
                    toastr.error('The information you have supplied is invalid!', 'Validation');
                    this.props.actions.validationError(error.response.data.errors);
                }
            });
    };

    handleChange = event => {
        event.preventDefault();
        let formValues = this.state;

        let name = event.target.name;
        formValues[name] = event.target.value;

        this.setState(formValues);
    };

    keyDown = e => {
        let event = window.event ? window.event : e;
        if (event.keyCode === 13) { //enter
            if (this.state.password !== "" && this.state.username !== "") {
                return false;
            }

            e.preventDefault();
            let usernameField = $('#username');
            let passwordField = $('#password');

            if (usernameField.is(':focus')) {
                passwordField.focus();
                return true;
            }

            usernameField.focus();
            return true;
        }

        return false;
    };

    render() {
        return (
            <section>
                <section className="p-5 widget text-center">
                    <img src="/assets/logo_plain.png" alt="Login Logo"/>
                </section>
                <section className="col-6 widget widget-shadow no-top">
                    <header>
                        <h1 className="text-center">Login User</h1>
                        <hr/>
                    </header>
                    <main>
                        <form id='login-form'>
                            <main onKeyDown={this.keyDown} className="p-3">
                                <section className='form-group'>
                                    <label>Username:</label>
                                    <input id='username' name='username' className='form-control' type='text'
                                           value={this.state.username}
                                           onChange={this.handleChange} placeholder='Username' required/>
                                    {this.props.auth.errors['username'] && <p className="error">{this.props.auth.errors['username']}</p>}
                                </section>
                                <section className='form-group'>
                                    <label>Password:</label>
                                    <input id='password' name='password' className='form-control' type='password'
                                           value={this.state.password}
                                           onChange={this.handleChange} placeholder='Password' required/>
                                    {this.props.auth.errors['password'] && <p className="error">{this.props.auth.errors['password']}</p>}
                                </section>
                            </main>
                            <footer className="pl-3 pr-3 pb-3 text-right">
                                <button className='btn btn-primary w-25' onClick={this.onSubmit}>Login</button>
                            </footer>
                        </form>
                    </main>
                </section>
            </section>
        )
    }

}

function mapStateToProps(state) {
    return {
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
